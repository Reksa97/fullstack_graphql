import React, { useState } from 'react'

const SetBirthyear = ({ editAuthor, show, result, setError }) => {
    const [name, setName] = useState('')
    const [birthyear, setBirthyear] = useState('')

    if (!show || result.loading) {
        return null
    }

    const submit = async (e) => {
        e.preventDefault()

        if (name === '') {
            setError('You must choose a name')
            return
        }

        const birthyearInt = parseInt(birthyear)
        try {
            await editAuthor({
                variables: { name: name, birthyear: birthyearInt }
            })
        } catch (err) {
            setError('Failed to set birthyear')
        }
        setBirthyear('')
    }

    let authors = result.data.allAuthors || []
    authors = authors.map(a => a.name)
    if (authors && name && name.length === 0) {
        setName(authors[0])
    }

    return (
        <div>
            <h2>set birthyear</h2>
            <form onSubmit={submit}>
                <table>
                    <tbody>
                        <tr>
                            <td>name</td>
                            <td>
                                <select onChange={({ target }) => { setName(target.value) }}>
                                    <option>Choose a name</option>
                                    {authors.map(a =>
                                        <option key={a} value={a} >{a}</option>
                                    )}
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <td>born in</td>
                            <td>
                                <input
                                    type='number'
                                    value={birthyear}
                                    onChange={({ target }) => setBirthyear(target.value)}
                                />
                            </td>
                        </tr>
                    </tbody>
                </table>
                <button type='submit'>update author</button>
            </form>
        </div>
    )
}

export default SetBirthyear