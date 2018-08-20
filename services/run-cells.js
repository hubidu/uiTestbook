import 'isomorphic-fetch'

export default async (docName, selectedCells) => {
  await fetch(`http://localhost:3001/api/documents/${docName}/run-selected`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(selectedCells)
  })
}