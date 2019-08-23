const { ApolloServer, gql } = require('apollo-server')
const uuid = require('uuid/v1')
const mongoose = require('mongoose')
const Book = require('./models/book')
const Author = require('./models/author')
const { MONGODB_URI } = require('./config')

mongoose.set('useFindAndModify', false)
console.log('connecting to', MONGODB_URI)
mongoose.connect(MONGODB_URI, { useNewUrlParser: true })
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connection to MongoDB:', error.message)
  })

let authors = [
  {
    name: 'Robert Martin',
    id: "afa51ab0-344d-11e9-a414-719c6709cf3e",
    born: 1952,
  },
  {
    name: 'Martin Fowler',
    id: "afa5b6f0-344d-11e9-a414-719c6709cf3e",
    born: 1963
  },
  {
    name: 'Fyodor Dostoevsky',
    id: "afa5b6f1-344d-11e9-a414-719c6709cf3e",
    born: 1821
  },
  { 
    name: 'Joshua Kerievsky', // birthyear not known
    id: "afa5b6f2-344d-11e9-a414-719c6709cf3e",
  },
  { 
    name: 'Sandi Metz', // birthyear not known
    id: "afa5b6f3-344d-11e9-a414-719c6709cf3e",
  },
]

/*
 * Saattaisi olla järkevämpää assosioida kirja ja sen tekijä tallettamalla kirjan yhteyteen tekijän nimen sijaan tekijän id
 * Yksinkertaisuuden vuoksi tallennamme kuitenkin kirjan yhteyteen tekijän nimen
*/

let books = [
  {
    title: 'Clean Code',
    published: 2008,
    author: 'Robert Martin',
    id: "afa5b6f4-344d-11e9-a414-719c6709cf3e",
    genres: ['refactoring']
  },
  {
    title: 'Agile software development',
    published: 2002,
    author: 'Robert Martin',
    id: "afa5b6f5-344d-11e9-a414-719c6709cf3e",
    genres: ['agile', 'patterns', 'design']
  },
  {
    title: 'Refactoring, edition 2',
    published: 2018,
    author: 'Martin Fowler',
    id: "afa5de00-344d-11e9-a414-719c6709cf3e",
    genres: ['refactoring']
  },
  {
    title: 'Refactoring to patterns',
    published: 2008,
    author: 'Joshua Kerievsky',
    id: "afa5de01-344d-11e9-a414-719c6709cf3e",
    genres: ['refactoring', 'patterns']
  },  
  {
    title: 'Practical Object-Oriented Design, An Agile Primer Using Ruby',
    published: 2012,
    author: 'Sandi Metz',
    id: "afa5de02-344d-11e9-a414-719c6709cf3e",
    genres: ['refactoring', 'design']
  },
  {
    title: 'Crime and punishment',
    published: 1866,
    author: 'Fyodor Dostoevsky',
    id: "afa5de03-344d-11e9-a414-719c6709cf3e",
    genres: ['classic', 'crime']
  },
  {
    title: 'The Demon ',
    published: 1872,
    author: 'Fyodor Dostoevsky',
    id: "afa5de04-344d-11e9-a414-719c6709cf3e",
    genres: ['classic', 'revolution']
  },
]

const typeDefs = gql`
  type Book {
    title: String!
    published: Int!
    author: Author!
    id: ID!
    genres: [String!]!
  }

  type Author {
    name: String!
    born: Int
    bookCount: Int
    id: ID!
  }

  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
  }

  type Mutation {
    addBook(
      title: String!
      author: String!
      published: Int!
      genres: [String!]!
    ): Book
    editAuthor(
      name: String!
      setBornTo: Int!
    ): Author
  }
`

const resolvers = {
  Query: {
    bookCount: () => Book.collection.countDocuments(),//books.length,
    authorCount: () => Author.collection.countDocuments(),//.length,
    allBooks: async (root, args) => {
      
      let author
      if (args.author) {
        author = await Author.findOne({ name: args.author })
        console.log('searched for author', args.author, 'gound author', author)
      }

      if (args.author && args.genre) {
        console.log('author and args.genre')
        if (!author) {
          return []
        }
        const books = await Book.find({ author: author, genres: args.genre })
        return books
      }
      if (args.author) {
        if (!author) {
          return []
        }
        const books = await Book.find({ author: author.id })
        console.log('found books by author', books)
        return books
      }
      if (args.genre) {
        return await Book.find({ genres: args.genre})
      }
      const books = await Book.find({})
      return books
    },
    allAuthors: async () => {
      authors = await Author.find({})
      return await authors
    }
  },
  Mutation: {
    addBook: async (root, args) => {
      console.log('adding book', args)
      let author = await Author.findOne({ name: args.author })
      if (!author) {
        console.log('adding and didnt find author')
        author = new Author({ name: args.author })
        try {
          await author.save()
        } catch (err) {
          console.log('cant save author', err)
          return
        }
      }
      
      const book = new Book({ ...args, author: author.id })
      try {
        await book.save();
      } catch (err) {
        console.log('cant save book', err)
        return
      }
      return book
    },
    editAuthor: async (root, args) => {
      let author = await Author.findOne({ name: args.name})
      console.log('editing author', author, args)
      author.born = args.setBornTo
      return await author.save()
    }
  },
  Author: {
    bookCount: async (root, args) => {
      //console.log('getting book count', root.id)
      const authorBooks = await Book.find({ author: root.id })
      //console.log('author books', root.id, authorBooks)
      return authorBooks.length
    }
  },
  Book: {
    author: async (root, args) => {
      //console.log('finding author for book', root.author)
      const bookAuthor = await Author.findOne({ _id: root.author })
      //console.log('found author', bookAuthor)
      return bookAuthor
    }
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`)
})
