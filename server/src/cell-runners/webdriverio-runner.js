const wdio = require("webdriverio");

const runnerEvents = require('./runner-events')
const {createScriptContext, evalCell} = require('../eval-script')

let ctx
let scriptContext

const before = async (ctx) => {
}

const after = async (ctx) => {
}

const WaitForTimeout = 20000
const ScriptTimeout = 15000

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

const _saveTakeScreenshot = async ctx => {
    try {
        const screenshot = await ctx.I.screenshot()
        return screenshot.value
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

      const screenshot = await _saveTakeScreenshot(ctx)
  
      eventInstance.fireExecutionSuccessfulEvt(cell, result, screenshot)
    } catch (err) {
        const screenshot = await _saveTakeScreenshot(ctx)

        eventInstance.fireExecutionFailedEvt(cell, err, screenshot)
  
        throw err
    }
  }

module.exports = {
    getContexts,
    before,
    after,
    run
}