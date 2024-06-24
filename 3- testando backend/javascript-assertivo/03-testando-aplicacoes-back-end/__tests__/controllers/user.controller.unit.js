import logger from "@jsassertivo/cli/src/utils/logger.js";
import { create, list, update, remove } from "controllers/user.controller.js";
import { createUser } from "services/user/create.js";
import findUser, { basedOnQuery } from "services/user/find.js";
import { updateUserByUid } from "services/user/update.js";
import { removeUser } from 'services/user/remove.js'

import faker from "faker";
import { createReq, createRes, createUserProperties } from "utils/create";

jest.mock("services/user/create.js");
jest.mock("services/user/find.js");
jest.mock("services/user/update.js");
jest.mock("services/user/remove.js")
jest.mock("@jsassertivo/cli/src/utils/logger.js");

describe("UserController", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("create", () => {
    it("should return 200 status when creating a user", async () => {
      const userProperties = createUserProperties();
      const mockedRequest = createReq({ body: userProperties });
      const mockResponse = createRes();
      const createdUserResponse = { uid: "some-crazy-uid", ...userProperties };
      createUser.mockResolvedValueOnce(createdUserResponse);

      await create(mockedRequest, mockResponse);

      expect(createUser).toBeCalledTimes(1);
      expect(createUser).toBeCalledWith(mockedRequest.body);
      expect(mockResponse.status).toBeCalledTimes(1);
      expect(mockResponse.status).toBeCalledWith(201);
      expect(mockResponse.json).toBeCalledTimes(1);
      expect(mockResponse.json).toBeCalledWith(createdUserResponse);
    });

    it("should return 500 status when an error occur and return the response", async () => {
      const userProperties = createUserProperties();
      const mockedRequest = createReq({ body: userProperties });
      const mockResponse = createRes();
      const createdUserError = { message: "There was an error" };

      createUser.mockRejectedValueOnce(createdUserError);

      await create(mockedRequest, mockResponse);
      expect(createUser).toBeCalledTimes(1);
      expect(createUser).toBeCalledWith(mockedRequest.body);
      expect(mockResponse.status).toBeCalledTimes(1);
      expect(mockResponse.status).toBeCalledWith(500);
      expect(mockResponse.json).toBeCalledTimes(1);
      expect(mockResponse.json).toBeCalledWith(createdUserError);
      expect(logger.error).toBeCalledTimes(1);
      expect(logger.error).toBeCalledWith(
        "Ocorreu um erro ao criar usuário",
        createdUserError
      );
    });
  });

  describe("list", () => {
    describe("find user by username", () => {
      let mockedRequest;
      let mockedResponse;
      let userProperties;

      beforeEach(() => {
        userProperties = createUserProperties({
          avatar: faker.internet.avatar(),
          uid: "my-id",
          username: "robertvitoriano",
        });
        mockedRequest = createReq({ query: { username: "robertvitoriano" } });
        mockedResponse = createRes();
      });

      it("Should be able to list User", async () => {
        basedOnQuery.mockReturnValueOnce({
          by: "username",
          param: "robertvitoriano",
        });
        findUser.username.mockResolvedValueOnce(userProperties);

        await list(mockedRequest, mockedResponse);

        expect(basedOnQuery).toBeCalledTimes(1);
        expect(basedOnQuery).toBeCalledWith(mockedRequest.query);
        expect(findUser.username).toBeCalledTimes(1);
        expect(findUser.username).toBeCalledWith(userProperties.username);
        expect(mockedResponse.status).toBeCalledTimes(1);
        expect(mockedResponse.status).toBeCalledWith(200);
        expect(mockedResponse.json).toBeCalledTimes(1);
        expect(mockedResponse.json).toBeCalledWith(userProperties);
      });
      it("Should return status 500 when an error ocurrs", async () => {
        basedOnQuery.mockReturnValueOnce({
          by: "username",
          param: "robertvitoriano",
        });
        const error = { message: "there was an error" };
        findUser.username.mockRejectedValueOnce(error);

        await list(mockedRequest, mockedResponse);

        expect(basedOnQuery).toBeCalledTimes(1);
        expect(basedOnQuery).toBeCalledWith(mockedRequest.query);
        expect(findUser.username).toBeCalledTimes(1);
        expect(findUser.username).toBeCalledWith(userProperties.username);
        expect(mockedResponse.status).toBeCalledTimes(1);
        expect(mockedResponse.status).toBeCalledWith(500);
        expect(mockedResponse.json).toBeCalledTimes(1);
        expect(mockedResponse.json).toBeCalledWith(error);
        expect(logger.error).toBeCalledTimes(1);
        expect(logger.error).toBeCalledWith(
          "Ocorreu um erro ao listar usuários",
          error
        );
      });
    });

    describe("update", () => {
      let mockedRequest;
      let mockedResponse;
      let userProperties;
      beforeEach(() => {
        userProperties = createUserProperties({
          avatar: faker.internet.avatar(),
          uid: "c5c08d3f-a773-4210-bc42-acae19935fda",
        });
        mockedRequest = createReq({
          body: { uid: userProperties.uid, name: userProperties.name },
        });
        mockedResponse = createRes();
      });
      it("Should return 202 when updating a user sucessfully", async () => {
        updateUserByUid.mockResolvedValueOnce(userProperties);

        await update(mockedRequest, mockedResponse);

        expect(updateUserByUid).toBeCalledTimes(1);
        expect(updateUserByUid).toBeCalledWith(mockedRequest.body);
        expect(mockedResponse.status).toBeCalledTimes(1);
        expect(mockedResponse.status).toBeCalledWith(202);
        expect(mockedResponse.json).toBeCalledTimes(1);
        expect(mockedResponse.json).toBeCalledWith(userProperties);
      });
      it("Should return status 500 when an error ocurrs", async () => {
        const error = { message: "there was an error" };

        updateUserByUid.mockRejectedValueOnce(error);

        await update(mockedRequest, mockedResponse);

        expect(updateUserByUid).toBeCalledTimes(1);
        expect(updateUserByUid).toBeCalledWith(mockedRequest.body);
        expect(mockedResponse.status).toBeCalledTimes(1);
        expect(mockedResponse.status).toBeCalledWith(500);
        expect(mockedResponse.json).toBeCalledTimes(1);
        expect(mockedResponse.json).toBeCalledWith(error);
        expect(logger.error).toBeCalledTimes(1);
        expect(logger.error).toBeCalledWith(
          "Ocorreu um erro ao atualizar usuário",
          error
        );
      });
    });
  });

  describe("remove", () => {
    let mockedRequest;
    let mockedResponse;
    let userProperties;
    beforeEach(() => {
      userProperties = createUserProperties({
        avatar: faker.internet.avatar(),
        uid: "c5c08d3f-a773-4210-bc42-acae19935fda",
      });
      mockedRequest = createReq({
        params: { uid: "somo-id" },
      });
      mockedResponse = createRes();
    });
    it("Should return 200 when removing a user sucessfully", async () => {
      removeUser.mockResolvedValueOnce(userProperties);

      await remove(mockedRequest, mockedResponse);

      expect(removeUser).toBeCalledTimes(1);
      expect(removeUser).toBeCalledWith(mockedRequest.params.uid);
      expect(mockedResponse.status).toBeCalledTimes(1);
      expect(mockedResponse.status).toBeCalledWith(202);
      expect(mockedResponse.json).toBeCalledTimes(1)
      expect(mockedResponse.json).toBeCalledWith(userProperties)

    });
    it("Should return status 500 when an error ocurrs", async () => {
      const error = { message: "there was an error" };
      removeUser.mockRejectedValueOnce(error);

      await remove(mockedRequest, mockedResponse);

      expect(removeUser).toBeCalledTimes(1);
      expect(removeUser).toBeCalledWith(mockedRequest.params.uid);
      expect(mockedResponse.status).toBeCalledTimes(1);
      expect(mockedResponse.status).toBeCalledWith(500);
      expect(mockedResponse.json).toBeCalledTimes(1)
      expect(mockedResponse.json).toBeCalledWith(error)
      expect(logger.error).toBeCalledTimes(1);
      expect(logger.error).toBeCalledWith("Ocorreu um erro ao remover usuário",error);
    });
  });
});
