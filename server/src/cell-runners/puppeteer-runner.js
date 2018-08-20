const got = require('got')
const Puppeteer = require('codeceptjs/lib/helper/Puppeteer')

const {createScriptContext, evalCell} = require('../eval-script')

// TODO Should be able to recreate the context
let ctx
let scriptContext

const before = async (ctx) => {
    await ctx.I._beforeSuite()
    await ctx.I._before()  
}

const after = async (ctx) => {
    await ctx.I._after()
    await ctx.I._afterSuite()  
}

const getContexts = () => {
    if (!ctx) {
        ctx = createContext()
        scriptContext = createScriptContext(ctx)
    }
    return {ctx, scriptContext}
}

const createContext = () => {
    const driver = new Puppeteer({
      show: true,
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
  
const run = async (ctx, scriptContext, events, cell) => {
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
  
      const result = await evalCell(scriptContext, cell)
  
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

module.exports = {
    getContexts,
    before,
    after,
    run
}