import React, { useState } from 'react'
import { gql } from 'apollo-boost'
import { useQuery, useMutation } from 'react-apollo-hooks'

import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import SetBirthyear from './components/SetBirthyear'
import Login from './components/Login'

const ALL_AUTHORS = gql`
{
  allAuthors {
    name
    born
    id
    bookCount
  }
}
`

const ALL_BOOKS_AND_GENRES = gql`
{
  allBooks {
    title
    published
    id
    author {
      name
    }
    genres
  }
  allGenres
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

const LOGIN = gql`
mutation login($username: String!, $password: String!) {
  login(username: $username, password: $password) {
    value
  }
}
`

const App = () => {
    const [page, setPage] = useState('authors')
    const [errorMessage, setErrorMessage] = useState(null)
    const [token, setToken] = useState(null)

    const setError = (errorMessage) => {
        setErrorMessage(errorMessage)
        setTimeout(() => {
            setErrorMessage(null)
        }, 10000)
    }

    const authorsResult = useQuery(ALL_AUTHORS)
    const booksResult = useQuery(ALL_BOOKS_AND_GENRES)

    const addBook = useMutation(CREATE_BOOK, {
        refetchQueries: [{ query: ALL_BOOKS_AND_GENRES }, { query: ALL_AUTHORS }]
    })

    const editAuthor = useMutation(EDIT_AUTHOR, {
        refetchQueries: [{ query: ALL_BOOKS_AND_GENRES }, { query: ALL_AUTHORS }]
    })

    const login = useMutation(LOGIN, {
        refetchQueries: [{ query: ALL_BOOKS_AND_GENRES }, { query: ALL_AUTHORS }]
    })

    return (
        <div>
            <button onClick={() => setPage('authors')}>authors</button>
            <button onClick={() => setPage('books')}>books</button>
            {token ? <button onClick={() => setPage('add')}>add book</button> : ""}
            {token ? 
                <button onClick={() => {
                    setToken(null)
                    setPage('login')
                }}>log off</button> 
                : 
                <button onClick={() => {setPage('login')}}>log in</button>
            }


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
                show={page === 'authors' && token}
                editAuthor={editAuthor}
                result={authorsResult}
                token={token}
                setError={setError}
            />

            <Books
                show={page === 'books'}
                result={booksResult}
            />

            <NewBook
                show={page === 'add' && token}
                addBook={addBook}
                token={token}
                setError={setError}
            />

            <Login
                show={page === 'login'}
                login={login}
                setToken={setToken}
                setPage={setPage}
                setError={setError}
            />
        </div >
    )
}

export default App
