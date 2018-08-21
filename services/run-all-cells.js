import 'isomorphic-fetch'

export default async (docName, cells) => {
  await fetch(`http://localhost:3001/api/documents/${docName}/run-all`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(cells)
  })
}