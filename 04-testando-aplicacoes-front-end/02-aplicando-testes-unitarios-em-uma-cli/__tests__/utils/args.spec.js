import parse, { validateArgs } from "../../src/utils/args";

const argsGivenFormatted = {
  username: "admin",
  password: "admin",
  operation: "operacao",
  data: {
    uid: "abc-123",
  },
};
describe("Test parse function", () => {
  it("parses arguments from CLI successfully", () => {
    const argsUnderTest = [
      "/Users/robertvitoriano/.nvm/versions/node/v14.11.0/bin/node",
      "/Users/robertvitoriano/.nvm/versions/node/v14.11.0/bin/jsassertivo",
      "--username=admin",
      "--password=admin",
      "--operation=operacao",
      '--data={"uid": "abc-123"}',
    ];
    const returnedObject = parse(argsUnderTest);

    expect(returnedObject).toEqual(argsGivenFormatted);
  });
});


describe("Test validateArgs function from args utility", () => {
  it("validates successfully the given fields", () => {
    const fields = ["username", "password", "operation", "data"];
    const returnedObject = validateArgs(argsGivenFormatted, fields);

    expect(returnedObject.valid).toEqual(true);
  });
  it("validates error  case scenarios", () => {
    expect(validateArgs()).toEqual({
      valid: false,
      message: expect.any(String),
    });

    expect(validateArgs(argsGivenFormatted, ['email'])).toEqual({
      valid:false,
      message:expect.any(String)
    })
  });
});
