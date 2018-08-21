const assert = require('assert')

const {getRunnerForCellType} = require('./cell-runners')

const getCurrentContext = () => ctx

const sessions = {}

const getRunnerForSession = (sessionId, documentType) => {
  sessions[sessionId] = sessions[sessionId] || getRunnerForCellType(documentType)
  return sessions[sessionId]
}

const run = async (sessionId, events, document, cells) => {
  if (!events) {
    console.log('WARNING Expected events')
    return
  }

  const runner = getRunnerForSession(sessionId, document.meta.type)
  assert(runner, `No runner found for doc type ${document.meta.type}`)

  const {ctx, scriptContext} = runner.getContexts()

  await runner.before(ctx)

  try {
    for (cell of cells) {
      if (cell.type === 'markdown') {
        // Anything to do here ?
      } else {
        await runner.run(ctx, scriptContext, events, cell)
      }
    }  
  } catch (err) {
    console.log('ERROR executing cell', cell, err)
  }

  await runner.after(ctx)
}

module.exports = {
  run,
  getRunnerForSession
}