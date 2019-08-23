import React, { useState } from 'react'

const NewBook = ({ addBook, show, setError }) => {
    const [title, setTitle] = useState('')
    const [author, setAuthor] = useState('')
    const [published, setPublished] = useState('')
    const [genre, setGenre] = useState('')
    const [genres, setGenres] = useState([])

    if (!show) {
        return null
    }

    const submit = async (e) => {
        e.preventDefault()

        const publishedInt = parseInt(published)
        try {
            await addBook({
                variables: { title, author, published: publishedInt, genres }
            })
        } catch (err) {
            setError('Failed to add book')
            return
        }

        setTitle('')
        setPublished('')
        setAuthor('')
        setGenres([])
        setGenre('')
    }

    const addGenre = () => {
        setGenres(genres.concat(genre))
        setGenre('')
    }

    return (
        <div>
            <form onSubmit={submit}>
                <table>
                    <tbody>
                        <tr>
                            <td>title</td>
                            <td>
                                <input
                                    value={title}
                                    onChange={({ target }) => setTitle(target.value)}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>author</td>
                            <td>
                                <input
                                    value={author}
                                    onChange={({ target }) => setAuthor(target.value)}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>published in</td>
                            <td>
                                <input
                                    type='number'
                                    value={published}
                                    onChange={({ target }) => setPublished(target.value)}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>genres</td>
                            <td>{genres.join(', ')}</td>
                        </tr>
                        <tr>
                            <td>
                                <input
                                    value={genre}
                                    onChange={({ target }) => setGenre(target.value)}
                                />
                            </td>
                            <td>
                                <button onClick={addGenre} type="button">add genre</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <button type='submit'>create book</button>
            </form>
        </div>
    )
}

export default NewBook