import express from 'express'
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/users', (req, res) => {
  res.send('Hello Smishniawka!')
})

app.post('/users', (req, res) => {
  res.send('We created smishniawku!!!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})