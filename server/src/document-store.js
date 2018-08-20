const assert = require('assert')

const getDocument = (docName) => {
   assert(docName, 'Expected a document name')

  return {
    title: 'Example document',
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
        type: 'codeceptjs', 
        content: `
await I.amOnPage('http://www.google.de')
        ` 
      },
      { 
        id: '4',
        state: 'initial',
        type: 'codeceptjs', 
        content: `
await I.fillField('q', 'codeceptjs')
await I.pressKey('Enter')
await I.waitForNavigation()
        ` 
      },
      { 
        id: '5',
        state: 'initial',
        type: 'codeceptjs', 
        content: `
await I.see('CodeceptJS')
        ` 
      },
      { 
        id: '6',
        state: 'initial',
        type: 'codeceptjs', 
        content: `
await I.click('End-to-End Testing With CodeceptJS - Monterail')
await I.waitForNavigation()
await I.see('Something')
        ` 
      }
    ]
    
  }
}

module.exports = {
  getDocument
}