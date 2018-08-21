const fireExecutionStartedEvt = (events, cell) => {
    events.emit('message', {
        type: 'execution.started',
        cell: Object.assign({}, cell, {
          state: 'running',
          runAt: Date.now(),
          screenshot: undefined,
          url: undefined,
        })
      })
}

const fireExecutionSuccessfulEvt = (events, cell, result, screenshot, url) => {
    events.emit('message', {
        type: 'execution.successful',
        cell: Object.assign({}, cell, {
          state: 'execution-successful',
          executedAt: Date.now(),
          screenshot,
          result,
          url,
          error: undefined
        })
      })
}

const fireExecutionFailedEvt = (events, cell, err, screenshot) => {
    events.emit('message', {
        type: 'execution.failed',
        cell: Object.assign({}, cell, {
          state: 'execution-failed',
          executedAt: Date.now(),
          screenshot,
          error: {
            message: err.toString(),
            actual: err.actual,
            expected: err.expected    
          }
        })
      })
}

module.exports = events => {
    return {
        fireExecutionStartedEvt: cell => fireExecutionStartedEvt(events, cell),
        fireExecutionSuccessfulEvt: (cell, result, screenshot, screenshotUrl, url) => fireExecutionSuccessfulEvt(events, cell, result, screenshot, screenshotUrl, url),
        fireExecutionFailedEvt: (cell, err, screenshot, screenshotUrl) => fireExecutionFailedEvt(events, cell, err, screenshot, screenshotUrl)
    }
}
