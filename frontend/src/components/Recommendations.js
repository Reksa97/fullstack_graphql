import React from 'react'
import { useQuery } from 'react-apollo-hooks'

const Recommendations = ({ booksWithGenreQuery, currentUserResult, show }) => {

    if (!show) {
        return null
    }

    if (currentUserResult.loading) {
        return (
            <div>Loading...</div>
        )
    }

    const currentUser = currentUserResult.data.me
    if (!currentUser || !currentUser.favoriteGenre) {
        return (
            <div>
               <h2>recommendations</h2>
                <p>you don't have a favorite genre :(</p>
            </div>
        )
    }

    const booksWithGenreResult = useQuery(booksWithGenreQuery, {variables: { genre: currentUser.favoriteGenre }})
    
    const books = booksWithGenreResult.data.allBooks || []

    return (
        <div>
            <h2>recommendations</h2>
            <p>books in your favorite genre <b>{currentUser.favoriteGenre}</b></p>
            <table>
                <tbody>
                    <tr>
                        <th>title</th>
                        <th>author</th>
                        <th>published</th>
                        <th>genres</th>
                    </tr>
                    {books.map(b =>
                        <tr key={b.title}>
                            <td>{b.title}</td>
                            <td>{b.author.name}</td>
                            <td>{b.published}</td>
                            <td>{b.genres.join(", ")}</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    )
}

export default Recommendations