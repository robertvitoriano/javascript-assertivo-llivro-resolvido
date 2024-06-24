import startServer from "./../../src/index";
import {
  clientHTTP,
  createUserListWithAdmin,
  createUserProperties,
} from "utils/create";
import logger from "@jsassertivo/cli/src/utils/logger";
import { loadDatabase } from "@jsassertivo/cli/src/database/file";
jest.mock("@jsassertivo/cli/src/database/file");
jest.mock("@jsassertivo/cli/src/utils/logger");
const users = createUserListWithAdmin();
const [admin, regularUser] = users;
loadDatabase.mockResolvedValue(users);
describe("User routes", () => {
  let server;
  let client;

  beforeEach(() => {
    server = startServer(4423);
    client = clientHTTP.createClient(server);
  });

  afterEach(() => {
    server.close();
  });

  describe("/user", () => {
    describe("/GET", () => {
      it("Deve retornar 401 para uma rota não autenticada", async () => {
        const { response: usersResponse } = await client.get("/user");

        expect(usersResponse.status).toBe(401);
      });
      it.each([
        ["username", "userName"],
        ["email", "email"],
        ["uid", "uid"],
      ])("query data by %s once authenticated", async (query, field) => {
        const authenticatedClient = clientHTTP.authenticateClient(
          client,
          admin
        );

        const usersResponse = await authenticatedClient.get("/user", {
          params: {
            [query]: regularUser[field],
          },
        });
        expect(usersResponse.status).toBe(200);
      });
    });

    describe("/POST", () => {
      it("Deve retornar 401 para uma rota não autenticada", async () => {
        const { response } = await client.post("/user");
        expect(response.status).toBe(401);
      });

      it("Should return 401 if the user is an administrator", async () => {
        const userToTest = createUserProperties();
        const authenticateClient = clientHTTP.authenticateClient(
          client,
          regularUser
        );
        const { response } = await authenticateClient.post("/user", userToTest);
        expect(response.status).toBe(401);
      });

      it.each([
        ["email"],
        ["password"],
        ["userName"],
        ["name"],
        ["lastName"]
      ])("Should not be able to create a user without %s an return status 400",async(field)=>{
          const userToTest = createUserProperties();
          delete userToTest[field]
          const authenticatedClient = clientHTTP.authenticateClient(client,admin)
          const {response} = await authenticatedClient.post('/user', userToTest)
          expect(response.status).toBe(400)
      })

      it("Should be able to create a user sucessfully when admin is authenticated and return 200", async () => {
        const authenticateClient = clientHTTP.authenticateClient(client, admin);
        const userToTest = createUserProperties();
        const response = await authenticateClient.post("/user", userToTest);
        expect(response.status).toBe(201);
        expect(response.data).toEqual(expect.objectContaining(userToTest));
      });
    });

    describe("/PATCH", () => {
      it("Deve retornar 401 para uma rota não autenticada", async () => {
        const { response } = await client.patch("/user");
        expect(response.status).toBe(401);
      });

      it("Should return 401 if the user is an administrator", async () => {
        const emailToTest = "adalberto@folha.com";
        const authenticateClient = clientHTTP.authenticateClient(
          client,
          regularUser
        );
        const { response } = await authenticateClient.patch("/user", {
          email: emailToTest,
          uid: regularUser.uid,
        });
        expect(response.status).toBe(401);
      });

      it("Should be able to update a user sucessfully when admin is authenticated and return 200", async () => {
        const authenticateClient = clientHTTP.authenticateClient(client, admin);
        const emailToTest = "adalberto@folha.com";
        const response = await authenticateClient.patch("/user", {
          email: emailToTest,
          uid: regularUser.uid,
        });
        expect(response.status).toBe(202);
        expect(response.data.email).toEqual(emailToTest);
      });
      it("Should return error to update a user if no uid is given", async () => {
        const authenticateClient = clientHTTP.authenticateClient(client, admin);
        const emailToTest = "adalberto@folha.com";
        const { response } = await authenticateClient.patch("/user", {
          email: emailToTest,
        });
        expect(response.status).toBe(400);
      });
      it("Should return status error 400  if no field to update is given", async () => {
        const authenticateClient = clientHTTP.authenticateClient(client, admin);
        const { response } = await authenticateClient.patch("/user", {
          uid: regularUser.uid,
        });
        expect(response.status).toBe(400);
      });
    });

    describe("/DELETE",()=>{
      it("Should be able to delete a user successfully",async()=>{
        const authenticateClient = clientHTTP.authenticateClient(client, admin)
        const response = await authenticateClient.delete(`/user/${users[5].uid}`)
        expect(response.status).toBe(202)
      })
      it("Should return 404 status  error if uuid is not provided",async()=>{
        const authenticateClient = clientHTTP.authenticateClient(client, admin)
        const {response} = await authenticateClient.delete('/user/')
        expect(response.status).toBe(404)
      })
      it("Should return 500 status error if a non existing id is provided",async()=>{
        const authenticateClient = clientHTTP.authenticateClient(client, admin)
        const {response} = await authenticateClient.delete('/user/asfdasdsadwas')
        expect(response.status).toBe(500)
      })
      it("Should return 401 status error if user trying to delete is not an administrator", async()=>{
        const authenticatedClient = clientHTTP.authenticateClient(client, regularUser)
        const {response} = await authenticatedClient.delete(`/user/${users[5].uid}`)
        expect(response.status).toBe(401)
      })
    })
  });
});
// página 218
