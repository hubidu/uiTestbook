const puppeteerRunner = require('./puppeteer-runner')
const webdriverioRunner = require('./webdriverio-runner')

const getRunnerForCellType = cellType => {
    if (cellType === 'codeceptjs') {
      return puppeteerRunner
    } else if(cellType === 'webdriverio') {
      return webdriverioRunner
    }
  }
  
module.exports = {
    getRunnerForCellType,
}