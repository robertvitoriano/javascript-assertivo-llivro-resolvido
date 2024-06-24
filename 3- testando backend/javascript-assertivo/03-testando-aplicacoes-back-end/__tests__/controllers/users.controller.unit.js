import logger from '@jsassertivo/cli/src/utils/logger.js';
import { list } from "controllers/users.controller.js";

// Services
import { findAll } from 'services/users/find.js';
import { createReq, createRes } from 'utils/create';

jest.mock('@jsassertivo/cli/src/utils/logger.js')
jest.mock('services/users/find.js')
describe("users.controller",async()=>{

  describe("list",()=>{
    afterEach(()=>{
      jest.clearAllMocks()
    })
    let mockResponse
    let mockRequest
    beforeEach(()=>{
      mockResponse = createRes()
      mockRequest = createReq()
    })
    it("should return 200 on success",async()=>{
      const users = [
        {
          email: "iamthe@admin.com",
          userName: "admin",
          password: "admin",
          name: "FooBarNameds",
          lastName: "Min",
          uid: "c5c08d3f-a773-4210-bc42-acae19935fda",
          avatar: "https://cdn.fakercloud.com/avatars/victordeanda_128.jpg",
          role: "ADMIN"
        }]
      findAll.mockResolvedValueOnce(users)
      await list(mockRequest, mockResponse)
      expect(findAll).toBeCalledTimes(1)
      expect(mockResponse.status).toBeCalledTimes(1)
      expect(mockResponse.status).toBeCalledWith(200)
      expect(mockResponse.json).toBeCalledTimes(1)
      expect(mockResponse.json).toBeCalledWith(users)

    })
    it("should return 500 on error",async()=>{
      const error= {message:"there was an error"}

      findAll.mockRejectedValue(error)

      await list(mockRequest, mockResponse)

      expect(findAll).toBeCalledTimes(1)
      expect(mockResponse.status).toBeCalledTimes(1)
      expect(mockResponse.status).toBeCalledWith(500)
      expect(mockResponse.json).toBeCalledTimes(1)
      expect(mockResponse.json).toBeCalledWith(error)
      expect(logger.error).toBeCalledTimes(1)
      expect(logger.error).toBeCalledWith('Ocorreu um erro ao listar usuários', error)
    })
  })
})
