import 'isomorphic-fetch'

export default async (steps) => {
  await fetch('http://localhost:3001/api/run-steps', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(steps)
  })
}