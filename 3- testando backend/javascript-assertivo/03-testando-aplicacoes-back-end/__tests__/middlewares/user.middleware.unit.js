import faker from "faker";
import { getUserData, validateToken, isAdmin, validateBody } from "middlewares/user.middleware";
import {validateDataMiddleware } from '@jsassertivo/cli/src/middlewares/index.js';

import find from 'services/user/find';
import logger from "@jsassertivo/cli/src/utils/logger";
import { createReq, createRes, createUserProperties, createNext, createUser } from "utils/create";
import ROLES from "@jsassertivo/cli/src/constants/roles";

jest.mock('services/user/find');
jest.mock("@jsassertivo/cli/src/utils/logger")
jest.mock('@jsassertivo/cli/src/middlewares/index.js')

describe("user.middleware.unit",()=>{
  let userProperties;
  let mockedResponse;
  let mockedRequest;
  let mockNext;

  beforeEach(() => {
    mockedRequest = createReq({ cookies: { uid: 'some-uid' } });
    mockedResponse = createRes();
    mockNext = createNext()
    userProperties = createUserProperties({ uid: 'some-uid', avatar: faker.internet.avatar() });
  });

  afterEach(()=>{
    jest.clearAllMocks();
  })
  describe('getUserData Find user information from an uid', () => {


    it("Should call next on success", async () => {
      find.uid.mockResolvedValueOnce(userProperties);

      await getUserData(mockedRequest, mockedResponse, mockNext);

      expect(find.uid).toBeCalledTimes(1);
      expect(find.uid).toBeCalledWith(userProperties.uid)
      expect(mockedRequest.user).toEqual(userProperties)
      expect(mockNext).toBeCalledTimes(1)
      expect(mockNext).toHaveBeenCalledWith()
    });

    it("Should return status 401 in case of error findind user and call next with error", async()=>{
      const error = {message:"error finding user"}

      find.uid.mockRejectedValueOnce(error)

      await getUserData(mockedRequest, mockedResponse, mockNext)

      expect(find.uid).toBeCalledTimes(1)
      expect(find.uid).toBeCalledWith(userProperties.uid)
      expect(mockedResponse.status).toBeCalledTimes(1)
      expect(mockedResponse.status).toBeCalledWith(401)
      expect(mockedResponse.json).toBeCalledTimes(1)
      expect(mockedResponse.json).toBeCalledWith({message:'Usuário não autenticado'})
      expect(mockNext).toBeCalledTimes(1)
      expect(mockNext).toBeCalledWith(error)
      expect(logger.error).toBeCalledTimes(1)
      expect(logger.error).toBeCalledWith(error)
    })

  });
  describe("validateToken",()=>{
    it("Should call nextFunction when token is valid",async()=>{
      mockedRequest.user = userProperties
      await validateToken(mockedRequest, mockedResponse, mockNext)
      expect(mockNext).toBeCalledTimes(1)
      expect(mockNext).toBeCalledWith()
    })
    it("Should fail if req.user is undefined",async()=>{
      const error = {message:'Token inválido'}
      await validateToken(mockedRequest, mockedResponse, mockNext)
      expect(mockedResponse.status).toBeCalledTimes(1)
      expect(mockedResponse.status).toBeCalledWith(401)
      expect(mockedResponse.json).toBeCalledTimes(1)
      expect(mockedResponse.json).toBeCalledWith(error)
      expect(mockNext).toBeCalledTimes(1)
      expect(mockNext).toBeCalledWith(new TypeError(error.message))
    })
  })

  describe('isAdmin verifica se a role é ADMIN', () => {
    it('Continua execução caso seja', () => {
      userProperties.role = ROLES.ADMIN
      mockedRequest.user = userProperties

      isAdmin(mockedRequest, mockedResponse, mockNext);

      expect(mockNext).toHaveBeenCalledTimes(1);
      expect(mockNext).toHaveBeenCalledWith();
    });
  });

  describe("validate  Body",()=>{
    afterEach(()=>{
      jest.clearAllMocks()
    })
    let mockRequest
    let mockResponse
    beforeEach(()=>{
      mockRequest = createReq({body:createUserProperties({avatar:faker.internet.avatar()})})
      mockResponse = createRes()
      mockNext = createNext()
    })
    describe("validate data for user creation",()=>{
      it("should continue exection in case of success",()=>{
        const fields = ['email', 'password', 'userName', 'name', 'lastName']
        const validateDataReturn = jest.fn()
        validateDataMiddleware.mockReturnValueOnce(validateDataReturn)
        validateBody(fields)(mockRequest,mockResponse, mockNext)
        expect(validateDataMiddleware).toBeCalledTimes(1)
        expect(validateDataMiddleware).toBeCalledWith(fields)
        expect(validateDataReturn).toBeCalledTimes(1)
        expect(validateDataReturn).toBeCalledWith({data:mockRequest.body})
        expect(mockNext).toBeCalledTimes(1)
        expect(mockNext).toBeCalledWith()
      })
      it('should throw an error if provided data is invalid', async () => {
        const fields = ['emagdil', 'passwodfgdrd', 'userNadfgdme', 'nadfgdme', 'lastNfdgfame'];
        const error = new Error('Validation error');
        const validateDataReturn = jest.fn().mockImplementation(() => {
          throw error
        });
        validateDataMiddleware.mockReturnValueOnce(validateDataReturn);
        validateBody(fields)(mockRequest,mockResponse, mockNext)

        expect(validateDataReturn).toThrowError("Validation error")

        expect(validateDataMiddleware).toBeCalledTimes(1);
        expect(mockResponse.status).toBeCalledTimes(1)
        expect(mockResponse.status).toBeCalledWith(400)
        expect(mockNext).toBeCalledTimes(1)
        expect(mockNext).toHaveBeenCalledWith(error)
      });
    })
  })
})
