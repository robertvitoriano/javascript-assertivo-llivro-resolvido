import applyMiddlewares from "../../src/middlewares/index.js"

it("should return a new function that call the remaining middlewares once it runs", () =>{
  const mid1 = jest.fn(data => data)
  const mid2 = jest.fn(data => data)

  const middlewaresChained = applyMiddlewares(mid1, mid2);

  //Expect middleware chained to be a function with the midlewares mid1 and mid2 combined
  expect(middlewaresChained).toEqual(expect.any(Function));

  // Expect middlewares chained to not be called yet
  expect(mid1).not.toHaveBeenCalled();
  expect(mid2).not.toHaveBeenCalled();
  // Pass some argument to go through mid1 and mid2 middlewares
  const someArgument = 'data'
  middlewaresChained(someArgument)
  //Check if middlewares were called with no problem
  expect(mid1).toHaveBeenCalledTimes(1);
  expect(mid1).toHaveBeenCalledWith(someArgument)
})
