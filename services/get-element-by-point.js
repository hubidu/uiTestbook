import 'isomorphic-fetch'

export default async (point, scaleFactor) => {
  await fetch('http://localhost:3001/api/get-element-by-point', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      point,
      scaleFactor
    })
  })
}