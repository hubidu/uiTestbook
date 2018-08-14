const util = require('util');
const vm = require('vm');

const createScriptContext = (ctx) => { 
  const scriptContext = vm.createContext(ctx)
  return scriptContext
}

const evalCodeceptjsCell = (scriptContext, cell) => {
  const script = `(async() => {
    ${cell.content}
  })();`

  const res = vm.runInContext(script, scriptContext);
  return res
}

module.exports = {
  evalCodeceptjsCell,
  createScriptContext
}