const elementFromPoint = async (events, ctx, point) => {
  const { I } = ctx

  console.log('Getting element under', point)
  const elementBounds = await I.executeScript(function(point) {
    var elem = document.elementFromPoint(point.x, point.y)
    elem.style = '2px solid red'
    return { 
      bounds: JSON.stringify(elem.getBoundingClientRect()),
      text: elem.innerText || elem.textContent,
    }
  }, point)

  events.emit('device', {
    type: 'element-from-point',
    point,
    elementBounds
  })
}

module.exports = {
  elementFromPoint,
}