const assert = require('assert')

const docs = {
  'SearchJobs': {
    name: 'SearchJobs',
    meta: {
      title: 'Bewerbung auf eine Softwareentwicklerposition bei CHECK24',
      type: 'puppeteer',
    },
    cells: [
      { 
        id: '0',
        state: 'initial',
        type: 'markdown', 
        content: `#### Bewerbung auf eine Softwareentwicklerposition bei CHECK24` 
      },
      { 
        id: '1',
        state: 'initial',
        type: 'markdown', 
        content: `  - Gehe zum Job Portal` 
      },
      { 
        id: '2',
        state: 'initial',
        type: 'puppeteer', 
        content: `await I.amOnPage('https://jobs.check24.de/')\n// Get the page title\nreturn await I.` 
      },
      { 
        id: '3',
        state: 'initial',
        type: 'markdown', 
        content: `  - Suche nach "react" jobs` 
      },
      { 
        id: '4',
        state: 'initial',
        type: 'puppeteer', 
        content: `await I.fillField('body #search', 'react docker')\nawait I.click('Job finden', '.btn.btn-m.primary.block')\nawait I.waitInUrl('/search')` 
      },
      { 
        id: '5',
        state: 'initial',
        type: 'markdown', 
        content: `  - Überprüfe die gefundenen Anzeigen` 
      },
      { 
        id: '6',
        state: 'initial',
        type: 'puppeteer', 
        content: `await I.seeElementInDOM('.filter--section')\nawait I.see('3 offene Stellen an 1 Standort', '.text-muted')\nawait I.seeNumberOfVisibleElements('.vacancy--box', 4)` 
      },
      { 
        id: '7',
        state: 'initial',
        type: 'markdown', 
        content: `  - Wechsle zu den Details einer Anzeige` 
      },
      { 
        id: '8',
        state: 'initial',
        type: 'puppeteer', 
        content: `// Return title of adds\nreturn await I.grabTextFrom('.vacancy--box')` 
      },
      { 
        id: '9',
        state: 'initial',
        type: 'puppeteer', 
        content: `await I.click('Werkstudent')\nawait I.waitForNavigation()` 
      },
      { 
        id: '10',
        state: 'initial',
        type: 'puppeteer', 
        content: `await I.see('selenium')\nawait I.see('docker')` 
      },
      { 
        id: '11',
        state: 'initial',
        type: 'markdown', 
        content: `  - Starte den Bewerbungsprozess` 
      },
      { 
        id: '12',
        state: 'initial',
        type: 'puppeteer', 
        content: `await I.click('Bewerben')\nawait I.waitForNavigation()` 
      },
      { 
        id: '13',
        state: 'initial',
        type: 'puppeteer', 
        content: `await I.see()` 
      },
    ]
  },

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
        type: 'puppeteer', 
        content: `\nawait I.amOnPage('http://www.google.de')` 
      },
      { 
        id: '4',
        state: 'initial',
        type: 'puppeteer', 
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
        content: `await I.context('WEBVIEW_de.check24.check24.beta')\nawait I.frame('DetailiFrame')`
      },
      { 
        id: '7',
        state: 'initial',
        type: 'webdriverio', 
        content: `await I.click('=vergleichen und wechseln')`
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