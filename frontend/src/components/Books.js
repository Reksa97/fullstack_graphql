import React from 'react'

const Books = ({ result, show }) => {
    if (!show) {
        return null
    }

    const books = result.data.allBooks || []

    if (result.loading) {
        return (
            <div>Loading...</div>
        )
    }

    return (
        <div>
            <h2>books</h2>

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