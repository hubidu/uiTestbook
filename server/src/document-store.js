const assert = require('assert')

const docs = {
  'Puppeteer': {
    name: 'Puppeteer',
    meta: {
      title: 'Basic test document',
      type: 'puppeteer',
    },
    cells: [
      { 
        id: '1',
        state: 'initial',
        type: 'markdown', 
        content: `### A Basic Test Document` 
      },
      { 
        id: '2',
        state: 'initial',
        type: 'markdown', 
        content: `Let's make UI testing **suck less**. With executable documents` 
      },
      { 
        id: '3',
        state: 'initial',
        type: 'webdriverio', 
        content: `\nawait I.amOnPage('http://www.google.de')` 
      },
      { 
        id: '4',
        state: 'initial',
        type: 'webdriverio', 
        content: `\nawait I.fillField('q', 'puppeteer')\nawait I.pressKey('Enter')\nawait I.waitForNavigation()` 
      },
    ]
  },

  'WebdriverIO': {
    name: 'WebdriverIO',
    meta: {
      title: 'Basic test document for webdriverio/Android testing',
      type: 'webdriverio',
    },
    cells: [
      { 
        id: '1',
        state: 'initial',
        type: 'markdown', 
        content: `### A Basic Test Document` 
      },
      { 
        id: '2',
        state: 'initial',
        type: 'webdriverio', 
        content: `await I.init()`
      },
      { 
        id: '3',
        state: 'initial',
        type: 'webdriverio', 
        content: `await I.waitAndClick(byId('de.check24.check24.beta:id/actionCenter'))\nawait I.waitAndClick(byId('de.check24.check24.beta:id/comparison_item'))

      `
      },
      { 
        id: '4',
        state: 'initial',
        type: 'webdriverio', 
        content: `await I.waitAndClick(byId('de.check24.check24.beta:id/close_btn'))\nawait I.waitAndClick(byId('de.check24.check24.beta:id/activity_tile_container'))\nawait I.waitAndSee('~Kfz-Versicherung')`
      },
      { 
        id: '5',
        state: 'initial',
        type: 'webdriverio', 
        content: `return await I.contexts()`
      },
      { 
        id: '6',
        state: 'initial',
        type: 'webdriverio', 
        content: `await I.context('WEBVIEW_de.check24.check24.beta')`
      },
    ]
  },
}

const getDocument = (docName) => {
   assert(docName, 'Expected a document name')

  return docs[docName]
}

module.exports = {
  getDocument
}