const wdio = require("webdriverio");

const runnerEvents = require('./runner-events')
const {createScriptContext, evalCell} = require('../eval-script')

const WaitForTimeout = 20000
const ScriptTimeout = 15000

let ctx
let scriptContext

const before = async (ctx) => {
}

const after = async (ctx) => {
}

// TODO Should support android AND ios and of course different versions of android ...
const _createContext = () => {
    const I = wdio.remote({
        port: 4723,
        waitForTimeout: WaitForTimeout,
        script: ScriptTimeout,
        desiredCapabilities: {
          newCommandTimeout: 0, // dont let appium kill the session if not commands are sent
          fullReset: false, // no full reset
          platformName: "Android",
          platformVersion: "8.1",
          deviceName: "Android Emulator",
          app: "C:\\Users\\stefan.huber\\projects\\mobile-tests\\check24-beta.apk",
          automationName: "UiAutomator2"
        }
      });

    Object.assign(I, {
        waitAndClick: async (selector, timeout = WaitForTimeout) => {
            await I.waitForVisible(selector, timeout)
            await I.click(selector)  
        },
        
        waitAndSee: async (selector, timeout = WaitForTimeout) => {
            await I.waitForVisible(selector, timeout)
        }
    })
          
    return {
      I,
      byId: resourceId => `//*[@resource-id='${resourceId}']`,
    }
  }

const getContexts = () => {
    if (!ctx) {
        ctx = _createContext()
        scriptContext = createScriptContext(ctx)
    }
    return {ctx, scriptContext}
}

const close = async () => {
    if (!ctx) return
    if (!ctx.I) return

    try {
        await ctx.I.end()
        ctx.I = undefined
    } catch (err) {
        console.log('WARNING Could not terminate webdriverio session')
    }
}

const _saveTakeScreenshot = async ctx => {
    try {
        const [screenshot, source, currentActivity] = [
            await ctx.I.screenshot(),
            await ctx.I.source(),
            await ctx.I.currentActivity(),
        ]

        return {
            screenshot: screenshot.value,
            activity: currentActivity.value,
            source: source.value,
            size: {width: 0, height: 0} // TODO Get device width and height
        }
    } catch (err) {
        console.log('WARNING Failed to take screenshot', err)
    }
    return undefined
}

const run = async (ctx, scriptContext, events, cell) => {
    const eventInstance = runnerEvents(events)

    try {
      console.log('Executing cell', cell)

      eventInstance.fireExecutionStartedEvt(cell)
    
      const result = await evalCell(scriptContext, cell)

      //   const screenshot = await _saveTakeScreenshot(ctx)
      const screenshot = undefined
      eventInstance.fireExecutionSuccessfulEvt(cell, result, screenshot)
    } catch (err) {
        // const screenshot = await _saveTakeScreenshot(ctx)
        const screenshot = undefined

        eventInstance.fireExecutionFailedEvt(cell, err, screenshot)
  
        throw err
    }
  }

module.exports = {
    getContexts,
    close,
    before,
    after,
    run
}