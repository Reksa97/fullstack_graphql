import React, { useState } from 'react'

const SetBirthyear = ({ editAuthor, show }) => {
    const [name, setName] = useState('')
    const [birthyear, setBirthyear] = useState('')


    if (!show) {
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

    return (
        <div>
            <h2>set birthyear</h2>
            <form onSubmit={submit}>
                <div>
                    name
                    <input
                        value={name}
                        onChange={({ target }) => setName(target.value)}
                    />
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