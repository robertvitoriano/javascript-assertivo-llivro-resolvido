const {falsoPositivo} = require('./falso-positivo')
describe("Mostrando um falso positivo", ()=>{
  it("Should test 'texto qualquer'", () =>{
    const returnedValue = falsoPositivo()
    const expectedValue = "texto qualquer"
    expect(returnedValue).toBe(expectedValue)
  })
})
