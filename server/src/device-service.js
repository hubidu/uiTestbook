const elementFromPoint = async (events, {ctx}, {point, scaleFactor}) => {
  const { I } = ctx

  const scaledPoint = {x: Math.round(point.x * scaleFactor), y: Math.round(point.y * scaleFactor)}

  const retval = await I.executeScript(function(point) {
    function getAttributes(el) {
      var namesAndValues=[];
      for (var att, i = 0, atts = el.attributes, n = atts.length; i < n; i++){
          att = atts[i];
          namesAndValues.push([att.nodeName, att.nodeValue])
      }
      return namesAndValues;
    }

    var elem = document.elementFromPoint(point.x, point.y)
    if (!elem) return

    elem.style = '2px solid red'
    return JSON.stringify({ 
      bounds: elem.getBoundingClientRect(),
      text: elem.innerText || elem.textContent,
      attributes: getAttributes(elem)
    })
  }, scaledPoint)

  if (!retval) {
    console.log('WARNING No element under point', point)
    return
  }

  element = JSON.parse(retval)
  element.bounds.top = Math.round(element.bounds.top / scaleFactor)
  element.bounds.left = Math.round(element.bounds.left / scaleFactor)
  element.bounds.right = Math.round(element.bounds.right / scaleFactor)
  element.bounds.bottom = Math.round(element.bounds.bottom / scaleFactor)
  element.bounds.width = Math.round(element.bounds.width / scaleFactor)
  element.bounds.height = Math.round(element.bounds.height / scaleFactor)


  events.emit('device', {
    type: 'element-from-point',
    point,
    element
  })
}

module.exports = {
  elementFromPoint,
}