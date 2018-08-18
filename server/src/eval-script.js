const util = require('util');
const vm = require('vm');

const createScriptContext = (ctx, retvals) => { 
  Object.assign(ctx, {
    console: {
      log: val => retvals.push(val)
    }
  })
  const scriptContext = vm.createContext(ctx)
  return scriptContext
}

const evalCodeceptjsCell = (scriptContext, cell) => {
  const code = cell.content.replace(/const /g, "this.") // execute in this context
  const scriptTemplate = `(async() => {
    ${code}
  })();`

  const script = new vm.Script(scriptTemplate);

  return script.runInContext(scriptContext, {displayErrors: true, timeout: 30000})
}

module.exports = {
  evalCodeceptjsCell,
  createScriptContext
}