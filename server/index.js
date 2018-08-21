const assert = require('assert')
const express = require('express')
const bodyParser = require('body-parser')

const port = parseInt(process.env.PORT, 10) || 3001

const server = express()

const runner = require('./src/runner')
const deviceService = require('./src/device-service')
const documentStore = require('./src/document-store')

const jsonParser = bodyParser.json()

server.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

/**
 * REST API
 */
let events // HACK of course we should be able to handle multiple connections
const FakeSessionId = 1

server.get('/api/documents/:docName', (req, res) => {
  res.json(documentStore.getDocument(req.params.docName))
})

server.post('/api/documents/:docName/run-selected', jsonParser, (req, res) => {
  const document = documentStore.getDocument(req.params.docName)
  if (!document) return res.status(404).json({message: 'document not found'})

  const selectedCells = req.body
  runner.run(FakeSessionId, events, document, selectedCells)

  res.json({
    result: 'ok'
  })
})

server.post('/api/documents/:docName/run-all', jsonParser, async (req, res) => {
  const document = documentStore.getDocument(req.params.docName)
  if (!document) return res.status(404).json({message: 'document not found'})

  const cells = req.body
  await runner.closeSession()
  runner.run(FakeSessionId, events, document, cells)

  res.json({
    result: 'ok'
  })
})

server.post('/api/get-element-by-point', jsonParser, (req, res) => {
  const cellRunner = runner.getRunnerForSession(FakeSessionId)
  assert(cellRunner, `No cell runner for session id ${FakeSessionId}`)

  deviceService.elementFromPoint(events, cellRunner.getContexts(), req.body)

  res.json({
    result: 'ok'
  })
})


const httpServer = server.listen(port, (err) => {
  if (err) throw err
  console.log(`> Ready on http://localhost:${port}`)
})

/**
 * Websockets
 */
const io = require('socket.io')(httpServer);
io.on('connection', socket => {
  console.log('user connected')
  events = socket

  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
})

