import React, { useState } from 'react'
import { gql } from 'apollo-boost'
import { useQuery, useMutation } from 'react-apollo-hooks'

import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import SetBirthyear from './components/SetBirthyear'

const ALL_AUTHORS = gql`
{
  allAuthors {
    name
    born
    bookCount
    id
  }
}
`

const ALL_BOOKS = gql`
{
  allBooks {
    title
    author
    published
  }
}
`

const CREATE_BOOK = gql`
mutation createBook($title: String!, $author: String!, $published: Int!, $genres: [String!]!) {
  addBook(
    title: $title,
    author: $author,
    published: $published,
    genres: $genres
  ) {
    title,
    author,
    published,
    genres,
    id
  }
}
`

const EDIT_AUTHOR = gql`
mutation editAuthor($name: String!, $birthyear: Int!) {
  editAuthor(
    name: $name,
    setBornTo: $birthyear
  ) {
    name,
    born,
    bookCount,
    id
  }
}
`

const App = () => {
    const [page, setPage] = useState('authors')
    const [errorMessage, setErrorMessage] = useState(null)

    const setError = (errorMessage) => {
      setErrorMessage(errorMessage)
      setTimeout(() => {
        setErrorMessage(null)
      }, 10000)
    }

    const authorsResult = useQuery(ALL_AUTHORS)
    const booksResult = useQuery(ALL_BOOKS)

    const addBook = useMutation(CREATE_BOOK, {
        refetchQueries: [{ query: ALL_BOOKS }, { query: ALL_AUTHORS }]
    })

    const editAuthor = useMutation(EDIT_AUTHOR, {
        refetchQueries: [{ query: ALL_BOOKS }, { query: ALL_AUTHORS }]
    })

    return (
        <div>
            <button onClick={() => setPage('authors')}>authors</button>
            <button onClick={() => setPage('books')}>books</button>
            <button onClick={() => setPage('add')}>add book</button>

            {errorMessage &&
              <div style={{ color: 'red' }}>
                 {errorMessage}
              </div>
            }

            <Authors
                show={page === 'authors'}
                result={authorsResult}
            />
            <SetBirthyear
                show={page === 'authors'}
                editAuthor={editAuthor}
                result={authorsResult}
                setError={setError}
            />

            <Books
                show={page === 'books'}
                result={booksResult}
            />

            <NewBook
                show={page === 'add'}
                addBook={addBook}
                setError={setError}
            />
    </div >
  )
}

export default App
