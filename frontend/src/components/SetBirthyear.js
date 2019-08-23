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
    //console.log('name', name)
    if (authors && name && name.length === 0) {
        setName(authors[0])
    }
    //console.log(name)
    return (
        <div>
            <h2>set birthyear</h2>
            <form onSubmit={submit}>
                <div>
                    name
                    <select onChange={({ target }) => {setName(target.value)}}>
                        <option>Choose a name</option>
                        {authors.map(a =>
                            <option key={a} value={a} >{a}</option>
                        )}
                    </select>
                </div>
                <div>
                    born in
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