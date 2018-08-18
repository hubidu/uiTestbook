const {evalCodeceptjsCell, createScriptContext} = require('./eval-script')

const test = require('ava')

test('it should return the value of an expression', async t => {
    const cell = {
        content: `
            const x = '10' // should become this.x
            const t = await Promise.resolve(5)
            console.log(t)
        `
    }
    const ctx = {}
    const retvals = []
    const scriptContext = createScriptContext(ctx, retvals)

    await evalCodeceptjsCell(scriptContext, cell)

    t.deepEqual([5], retvals)
    t.is('10', scriptContext.x)
    t.is(5, scriptContext.t)
})