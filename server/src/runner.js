const got = require('got')
const Puppeteer = require('codeceptjs/lib/helper/Puppeteer')
const {createScriptContext, evalCodeceptjsCell} = require('./eval-script')

const createContext = () => {
  const driver = new Puppeteer({
    show: false,
    waitForTimeout: 10000,
    getPageTimeout: 10000,
    waitForAction: 0,
    restart: false,
    keepCookies: true,
    keepBrowserState: true,
    fullPageScreenshots: true,
    waitForNavigation: 'networkidle0',
    windowSize: '1900x2000'
  })
  
  const json = got.extend({
    json: true
  });

  return {
    I: driver,
    httpGet: async url => (await json.get(url)).body
  }
}

const runCodeceptjsCell = async (ctx, scriptContext, events, cell) => {
  try {
    console.log('Executing cell', cell)

    events.emit('message', {
      type: 'execution.started',
      cell: Object.assign({}, cell, {
        state: 'running',
        runAt: Date.now(),
        screenshot: undefined,
        url: undefined,
      })
    })

    if (cell.url) {
      await ctx.I.amOnPage(cell.url)
    }
    const url = await ctx.I.grabCurrentUrl()

    const result = await evalCodeceptjsCell(scriptContext, cell)

    const [screenshot, screenshotUrl] = await Promise.all([
      await ctx.I.page.screenshot(),
      await ctx.I.grabCurrentUrl()
    ])

    events.emit('message', {
      type: 'execution.successful',
      cell: Object.assign({}, cell, {
        state: 'execution-successful',
        executedAt: Date.now(),
        screenshot,
        screenshotUrl,
        result,
        url,
        error: undefined
      })
    })
  } catch (err) {
    const [screenshot, screenshotUrl] = await Promise.all([
      await ctx.I.page.screenshot(),
      await ctx.I.grabCurrentUrl()
    ])

    events.emit('message', {
      type: 'execution.failed',
      cell: Object.assign({}, cell, {
        state: 'execution-failed',
        executedAt: Date.now(),
        screenshot,
        screenshotUrl,
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
const scriptContext = createScriptContext(ctx)

const getCurrentContext = () => ctx

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
        await runCodeceptjsCell(ctx, scriptContext, events, cell)
      }
    }  
  } catch (err) {
    console.log('ERROR executing cell', cell, err)
  }

  await ctx.I._after()
  await ctx.I._afterSuite()
}

module.exports = {
  run,
  getCurrentContext
}