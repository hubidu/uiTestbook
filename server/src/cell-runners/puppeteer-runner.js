const got = require('got')
const Puppeteer = require('codeceptjs/lib/helper/Puppeteer')

const runnerEvents = require('./runner-events')
const getViewportSize = require('./browser-scripts/get-viewport-size')

const {createScriptContext, evalCell} = require('../eval-script')

// TODO Should be able to recreate the context
let ctx
let scriptContext

const _takeScreenshot = async I => {
  try {
    const [screenshot, pageUrl, viewportSize, pageTitle] = await Promise.all([
      await I.page.screenshot(),
      await I.grabCurrentUrl(),
      await I.executeScript(getViewportSize),
      await I.grabTitle()
    ])
    
    const ss = {
      screenshot,
      url: pageUrl,
      title: pageTitle,
      size: viewportSize
    }
    
    return ss  
  } catch (err) {
    console.log('WARNING Error taking screenshot', err)
  }
}

const close = async () => {
  if (!ctx) return
  if (!ctx.I) return

  await ctx.I._stopBrowser()
  ctx = undefined
  scriptContext = undefined
}

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
      getPageTimeout: 30000,
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
    const eventInstance = runnerEvents(events)
    try {
      console.log('Executing cell', cell)
  
      eventInstance.fireExecutionStartedEvt(cell)

      if (cell.url) {
        // TODO Use history api
        await ctx.I.amOnPage(cell.url)
      }
      const beforeUrl = await ctx.I.grabCurrentUrl()

      const result = await evalCell(scriptContext, cell)
  
      const ss = await _takeScreenshot(ctx.I)

      eventInstance.fireExecutionSuccessfulEvt(cell, result, ss, beforeUrl)

    } catch (err) {
      console.log('ERROR during cell execution', err)
      const ss = await _takeScreenshot(ctx.I)

      eventInstance.fireExecutionFailedEvt(cell, err, ss)
   
      throw err
    }
  }

module.exports = {
    getContexts,
    before,
    after,
    run,
    close,
}