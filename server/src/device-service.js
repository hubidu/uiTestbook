const elementFromPoint = async (events, {ctx}, point) => {
  const { I } = ctx

  console.log('Getting element under', point)
  const element = await I.executeScript(function(point) {
    var elem = document.elementFromPoint(point.x, point.y)
    if (!elem) return

    elem.style = '2px solid red'
    return { 
      bounds: JSON.stringify(elem.getBoundingClientRect()),
      text: elem.innerText || elem.textContent,
    }
  }, point)

  if (!element) {
    console.log('WARNING No element under point', point)
    return
  }

  element.bounds = JSON.parse(element.bounds)

  events.emit('device', {
    type: 'element-from-point',
    point,
    element
  })
}

module.exports = {
  elementFromPoint,
}