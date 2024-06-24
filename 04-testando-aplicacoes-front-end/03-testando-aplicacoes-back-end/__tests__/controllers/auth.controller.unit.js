// Controller
import { authenticate } from 'controllers/auth.controller';
import logger from '@jsassertivo/cli/src/utils/logger.js';
import findUser from 'services/user/find';
import { createReq, createRes, createAuth } from 'utils/create';

jest.mock('@jsassertivo/cli/src/utils/logger.js');
jest.mock('services/user/find');

describe('testing user authentication', () => {

  afterEach(() => {
    jest.clearAllMocks();
    });

  it('should find user and insert uid in a cookie', async () => {

    const credentials = createAuth()
    const mockRequest = createReq({body: credentials})
    const mockResponse = createRes()

    const fields = {
      uid: 'qualqusdfsdfsder-uid',
      ...credentials
      };

    findUser.usernameAndPassword.mockResolvedValueOnce(fields);
    await authenticate(mockRequest, mockResponse);
    expect(findUser.usernameAndPassword).toHaveBeenCalledTimes(1)
    expect(findUser.usernameAndPassword).toHaveBeenCalledWith(mockRequest.body.username, mockRequest.body.password)

    expect(mockResponse.cookie.mock.calls).toEqual([["uid", fields.uid]])
    expect(mockResponse.json).toHaveBeenCalledTimes(1);
    expect(mockResponse.json).toHaveBeenCalledWith(fields)
  })
})

it("Should return 404 when a user is not found",async()=>{

  const mockRequest = createReq({body: createAuth()})
  const mockResponse = createRes()
  const error = "Usuário não existente"
  findUser.usernameAndPassword.mockRejectedValueOnce(error)
  await authenticate(mockRequest, mockResponse);
  expect(findUser.usernameAndPassword).toHaveBeenCalledTimes(1)
  expect(findUser.usernameAndPassword).toHaveBeenCalledWith(mockRequest.body.username, mockRequest.body.password)
  expect(logger.error).toHaveBeenCalledTimes(1)
  expect(logger.error).toHaveBeenCalledWith(expect.any(String), error)
  expect(mockResponse.status).toHaveBeenCalledTimes(1)
  expect(mockResponse.status).toHaveBeenCalledWith(404)
  expect(mockResponse.json).toHaveBeenCalledTimes(1)
  expect(mockResponse.json).toHaveBeenCalledWith({message:error})
})

//página 168
