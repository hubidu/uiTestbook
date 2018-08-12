const util = require('util');
const vm = require('vm');

const evalCodeceptjsCell = (ctx, cell) => {
  const script = new vm.Script(`(async() => {
    ${cell.content}
  })();`);
  
  const scriptContext = vm.createContext(ctx);
 
  const res = script.runInContext(scriptContext);

  return res
}

module.exports = {
  evalCodeceptjsCell
}