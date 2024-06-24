const { calculaDesconto, somaHorasExtras } = require('./ola-jest')




describe("Operacoes", () =>{

  it("Should sum extra hours", () =>{
    const expectedValue = 10;
    const returnValue = somaHorasExtras(5,5)
    expect(returnValue).toBe(expectedValue)
  })

  it("Should calculculate the discounts", ()=>{
    const returnValue = calculaDesconto(60,20);
    const expectedValue = 40;
    expect(returnValue).toBe(40)
  })
})
