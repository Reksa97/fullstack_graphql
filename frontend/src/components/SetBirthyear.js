import React, { useState } from 'react'

const SetBirthyear = ({ editAuthor, show, result }) => {
    const [name, setName] = useState('')
    const [birthyear, setBirthyear] = useState('')

    if (!show || result.loading) {
        return null
    }

    const submit = async (e) => {
        e.preventDefault()

        const birthyearInt = parseInt(birthyear)
        await editAuthor({
            variables: { name, birthyear: birthyearInt }
        })
        setName('')
        setBirthyear('')
    }

    let authors = result.data.allAuthors.map(a => a.name)
    return (
        <div>
            <h2>set birthyear</h2>
            <form onSubmit={submit}>
                <div>
                    name
                    <select onChange={({ target }) => setName(target.value)}>
                        {authors.map(a =>
                            <option key={a} value={a} >{a}</option>
                        )}
                    </select>
                </div>
                <div>
                    born
                    <input
                        type='number'
                        value={birthyear}
                        onChange={({ target }) => setBirthyear(target.value)}
                    />
                </div>
                <button type='submit'>update author</button>
            </form>
        </div>
    )
}

export default SetBirthyear