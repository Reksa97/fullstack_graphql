const { ApolloServer, UserInputError, AuthenticationError, PubSub, gql } = require('apollo-server')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const Book = require('./models/book')
const Author = require('./models/author')
const User = require('./models/user')
const { MONGODB_URI } = require('./config')

const JWT_SECRET = 'VERY_SECRET_KEY_HERE_YESS'

const pubsub = new PubSub()

mongoose.set('useFindAndModify', false)
console.log('connecting to', MONGODB_URI)
mongoose.connect(MONGODB_URI, { useUnifiedTopology: true, useNewUrlParser: true })
    .then(() => {
        console.log('connected to MongoDB')
    })
    .catch((error) => {
        console.log('error connection to MongoDB:', error.message)
    })

const typeDefs = gql`
  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  }

  type Token {
    value: String!
  }

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
    allGenres: [String!]!
    me: User
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

    login(
      username: String!
      password: String!
    ): Token

    createUser(
      username: String!
      favoriteGenre: String!
    ): User
  }

  type Subscription {
      bookAdded: Book!
  }
`

const resolvers = {
    Query: {
        bookCount: () => Book.collection.countDocuments(),
        authorCount: () => Author.collection.countDocuments(),
        allBooks: async (root, args) => {

            let author
            if (args.author) {
                author = await Author.findOne({ name: args.author })
                console.log('searched for author', args.author, 'found author', author)
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
                return await Book.find({ genres: args.genre })
            }
            const books = await Book.find({})
            return books
        },
        allAuthors: async () => {
            authors = await Author.find({})
            return await authors
        },
        allGenres: async () => {
            const books = await Book.find({})
            let genres = []
            for (book of books) {
                for (genre of book.genres) {
                    if (!genres.includes(genre)) {
                        genres.push(genre)
                    } 
                }
            }
            console.log('returning genres', genres)
            return genres
        },
        me: async (root, args, { currentUser }) => {
            if (!currentUser) {
                throw new AuthenticationError('User has not authenticated')
            }
            console.log('returning me', currentUser)
            return currentUser
        }
    },
    Mutation: {
        addBook: async (root, args, { currentUser }) => {
            if (!currentUser) {
                throw new AuthenticationError('User has not authenticated')
            }

            let author = await Author.findOne({ name: args.author })
            if (!author) {
                author = new Author({ name: args.author })
                try {
                    await author.save()
                } catch (err) {
                    throw new UserInputError(err.message, {
                        invalidArgs: args
                    })
                }
            }

            const book = new Book({ ...args, author: author.id })
            try {
                await book.save();
            } catch (err) {
                throw new UserInputError(err.message, {
                    invalidArgs: args
                })
            }

            pubsub.publish('BOOK_ADDED', { bookAdded: book })

            return book
        },
        editAuthor: async (root, args, { currentUser }) => {
            if (!currentUser) {
                throw new AuthenticationError('User has not authenticated')
            }

            let author = await Author.findOne({ name: args.name })
            console.log('editing author', author, args)
            author.born = args.setBornTo
            try {
                await author.save()
            } catch (err) {
                throw new UserInputError(err.message, {
                    invalidArgs: args
                })
            }
            return author
        },
        createUser: async (root, args) => {
            const user = new User({ username: args.username, favoriteGenre: args.favoriteGenre })
            console.log('creating user', user)
            try {
                await user.save()
            } catch (err) {
                throw new UserInputError(err.message, {
                    invalidArgs: args
                })
            }
            return user
        },
        login: async (root, args) => {
            const user = await User.findOne({ username: args.username })
            if (!user || args.password !== 'password') {
                throw new UserInputError('invalid credentials')
            }
            const userForToken = {
                username: user.username,
                id: user._id
            }

            return { value: jwt.sign(userForToken, JWT_SECRET) }
        }
    },
    Subscription: {
        bookAdded: {
            subscribe: () => pubsub.asyncIterator(['BOOK_ADDED'])
        }
    },
    Author: {
        bookCount: async (root, args) => {
            const authorBooks = await Book.find({ author: root.id })
            return authorBooks.length
        }
    },
    Book: {
        author: async (root, args) => {
            const bookAuthor = await Author.findOne({ _id: root.author })
            return bookAuthor
        }
    }
}

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ req }) => {
        const auth = req ? req.headers.authorization : null
        if (auth && auth.toLowerCase().startsWith('bearer ')) {
            const decodedToken = jwt.verify(
                auth.substring(7), JWT_SECRET
            )
            const currentUser = await User.findById(decodedToken.id)
            return { currentUser }
        }
    }
})

server.listen().then(({ url, subscriptionsUrl }) => {
    console.log(`Server ready at ${url}`)
    console.log(`Subscriptions ready at ${subscriptionsUrl}`)
})
