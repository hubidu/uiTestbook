const Puppeteer = require('codeceptjs/lib/helper/Puppeteer')
const {evalCodeceptjsCell} = require('./eval-script')

const createContext = () => {
  const driver = new Puppeteer({
    waitForTimeout: 10000,
    waitForAction: 0,
    restart: false,
    fullPageScreenshots: true,
    waitForNavigation: 'load',
    windowSize: '1900x2000'
  })
  
  return {
    I: driver
  }
}

const runCodeceptjsCell = async (events, cell) => {
  try {
    console.log('Executing cell', cell)

    if (cell.url) {
      await ctx.I.amOnPage(cell.url)
    }
    const url = await ctx.I.grabCurrentUrl()

    events.emit('message', {
      type: 'execution.started',
      cell: Object.assign(cell, {
        state: 'running',
        runAt: Date.now(),
        screenshot: undefined,
        url
      })
    })

    const result = await evalCodeceptjsCell(ctx, cell)

    const screenshot = await ctx.I.page.screenshot()

    events.emit('message', {
      type: 'execution.successful',
      cell: Object.assign(cell, {
        state: 'execution-successful',
        executedAt: Date.now(),
        screenshot,
        result,
        error: undefined
      })
    })
  } catch (err) {
    const screenshot = await ctx.I.page.screenshot()

    events.emit('message', {
      type: 'execution.failed',
      cell: Object.assign(cell, {
        state: 'execution-failed',
        executedAt: Date.now(),
        screenshot,
        error: {
          message: err.toString(),
          actual: err.actual,
          expected: err.expected    
        }
      })
    })

    throw err
  }
}

// TODO Should be able to recreate the context
const ctx = createContext()

const run = async (events, cells) => {
  if (!events) {
    console.log('WARNING Expected events')
    return
  }

  await ctx.I._beforeSuite()
  await ctx.I._before()

  try {
    for (cell of cells) {
      if (cell.type === 'codeceptjs') {
        await runCodeceptjsCell(events, cell)
      }
    }  
  } catch (err) {
    console.log('ERROR executing cell', cell, err)
  }

  await ctx.I._after()
  await ctx.I._afterSuite()
}

module.exports = {
  run
}