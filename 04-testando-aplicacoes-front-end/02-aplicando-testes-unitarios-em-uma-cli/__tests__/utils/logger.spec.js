import logger from 'utils/logger.js';

describe("Test console.log calling in logger object", () => {
  //sobrescreve a implementação original de alguma função jest.fn() com o callback passado em mockImplementation
  const spyLog = jest.spyOn(console, 'log').mockImplementation();
  const spyError = jest.spyOn(console, 'error').mockImplementation();

  beforeEach(() => {
    // reinicia a contagem de chamadas de console.log depois de cada teste
    jest.clearAllMocks()
  })

  afterAll(() => {
    //desfaz o mock da função ao finalizar o teste
    jest.restoreAllMocks();
  })

  it('should call console.log function 1 time once log in logger object is called', () => {
    logger.log('test')
    expect(spyLog).toHaveBeenCalledTimes(1)
  })

  it('should call console.log function 1 time once success in logger object is called', () => {
    logger.success('test')
    expect(spyLog).toHaveBeenCalledTimes(1)
  })
  it('should call console.error function 1 time, once error function in logger object is called',() =>{
    logger.error('test error')
    expect(spyError).toHaveBeenCalledTimes(1)
  })
})

