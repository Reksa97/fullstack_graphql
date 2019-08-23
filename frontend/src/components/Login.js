import React, { useState } from 'react'

const Login = ({ login, show, setToken, setPage, setError }) => {
    const [username, setUsername] = useState('')
    if (!show) {
        return null
    }

    const submit = async (e) => {
        e.preventDefault()
        try {
            const a = await login({
                variables: { username, password: 'password' }
            })
            setToken(a.data.login.value)
            setPage('authors')
        } catch (err) {
            setError('Invalid username')
        }
    }

    return (
        <div>
            <h2>log in</h2>
            <form onSubmit={submit}>
                <table>
                    <tbody>
                        <tr>
                            <td>username</td>
                            <td>
                                <input
                                    type='username'
                                    value={username}
                                    onChange={({ target }) => setUsername(target.value)}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>password</td>
                            <td>
                                <input type='password' readOnly value='password' />
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div>
                    <button type='submit'>log in</button>
                </div>
            </form>
        </div>
    )
}

export default Login