import React from 'react'

const Authors = ({ result, show }) => {
  if (!show) {
    return null
  }
  const authors = result.data.allAuthors || []

  if (result.loading) {
    return(
      <div>Loading...</div>
    )
  }
  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th>name</th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map(a =>
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default Authors