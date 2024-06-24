import {
  getUserByUsername,
  getUserByEmail,
  basedOnQuery,
} from "services/user/find";
import { loadDatabase } from "@jsassertivo/cli/src/database/file.js";
import { createUserList, createUserProperties } from "utils/create";
import { query } from "express";
jest.mock("@jsassertivo/cli/src/database/file.js");
describe("find", () => {
  describe("getUserByName", () => {
    afterEach |
      (() => {
        jest.clearAllMocks();
      });
    it("Retorna um usuário a encontrar", async () => {
      const userList = createUserList();
      const [user] = userList;
      loadDatabase.mockResolvedValueOnce(userList);
      const foundUser = await getUserByUsername(user.userName);
      expect(user).toEqual(foundUser);
    });

    it("returns error if username does not exist", async () => {
      const userList = createUserList();
      loadDatabase.mockResolvedValueOnce(userList);
      await expect(
        getUserByUsername("usuário-que-não-existe")
      ).rejects.toThrowError("Não existe usuário com username informado.");
    });
  });
  describe("getUser by Email", () => {
    afterEach |
      (() => {
        jest.clearAllMocks();
      });
    it("Retorna um usuário a encontrar", async () => {
      const userList = createUserList();
      const [user] = userList;
      loadDatabase.mockResolvedValueOnce(userList);
      const foundUser = await getUserByEmail(user.email);
      expect(user).toEqual(foundUser);
    });

    it("returns error if email does not exist", async () => {
      try {
        const userList = createUserList();
        loadDatabase.mockResolvedValueOnce(userList);
        const user = createUserProperties();
        getUserByEmail(user.email);
      } catch (error) {
        expect(error.message).toBe("Não existe usuário com email informado.");
      }
    });
  });
  describe("basedOnQuery finds function within the service", () => {
    it.each([
      ['uid', { uid: 'qualquer-uid' }],
      ['email', { email: 'qualquer@email.com' }],
      ['username', { username: 'usuario' }],

      ])('Retorna a função que consulta usuário por %s e seu valor', (fn, query) => {
      const { by, param } = basedOnQuery(query);
      expect(by).toEqual(fn);
      expect(param).toEqual(query[by]);
    });

    it("it should throw an error when param is not accepted", () => {
      try {
        const queryObject = { uissd: "qualquer-uid" };

        basedOnQuery(queryObject);
      } catch (error) {
        expect(error.message).toBe(
          "Você precisa informar uid, email ou username para fazer uma busca"
        );
      }
    });
  });
});

//página 198
