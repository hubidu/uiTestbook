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

const fireExecutionSuccessfulEvt = (events, cell, result, screenshot, screenshotUrl, url) => {
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
}

const fireExecutionFailedEvt = (events, cell, err, screenshot, screenshotUrl) => {
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
}

module.exports = events => {
    return {
        fireExecutionStartedEvt: cell => fireExecutionStartedEvt(events, cell),
        fireExecutionSuccessfulEvt: (cell, result, screenshot) => fireExecutionSuccessfulEvt(events, cell, result, screenshot),
        fireExecutionFailedEvt: (cell, err, screenshot) => fireExecutionFailedEvt(events, cell, err, screenshot)
    }
}
