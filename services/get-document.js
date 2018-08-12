import 'isomorphic-fetch'

export default async (documentName) => {
  const res = await fetch(`http://localhost:3001/api/documents/${documentName}`)

  return res.json()
}