import React, { useState } from 'react'

const Books = ({ result, show }) => {
    const [genre, setGenre] = useState('')
    if (!show) {
        return null
    }

    if (result.loading) {
        return (
            <div>Loading...</div>
        )
    }
    
    let books = result.data.allBooks || []
    const genres = result.data.allGenres || []

    if (genre) {
        books = books.filter(book => book.genres.includes(genre))
    }

    return (
        <div>
            <h2>books</h2>
            <select onChange={({ target }) => { setGenre(target.value) }}>
                <option value=''>Choose a genre</option>
                {genres.map(a =>
                    <option key={a} value={a} >{a}</option>
                )}
            </select>
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

export default Books