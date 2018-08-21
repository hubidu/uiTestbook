const puppeteerRunner = require('./puppeteer-runner')
const webdriverioRunner = require('./webdriverio-runner')

const runners = {
  'puppeteer': puppeteerRunner,
  'webdriverio': webdriverioRunner,
}

const getRunnerForCellType = cellType => runners[cellType]
  
module.exports = {
    getRunnerForCellType,
}