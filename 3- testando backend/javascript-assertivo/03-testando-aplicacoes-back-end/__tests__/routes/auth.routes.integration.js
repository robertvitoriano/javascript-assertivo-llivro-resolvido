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
    describe("/POST", () => {
      it.each([["username","userName"], ["password", "password"]])(
        "Should return error when just &s is sent in body",
        async (bodyParam, field) => {
          const {response} = await client.post('/auth/login',{[bodyParam]:regularUser[field]})
          expect(response.status).toBe(404)
        }
      );
      it("SHould not be able to login a non existing user",async()=>{
        const {userName, password} = createUserProperties()
        const {response} = await client.post('/auth/login',{username:userName, password})
        expect(response.status).toBe(404)
      })

      it("Should be able to login successfully an existing user",async()=>{
        const {userName:username, password} = regularUser
        const response = await client.post('/auth/login',{username, password})
        expect(response.status).toBe(200)
        expect(response.data).toMatchObject(regularUser)
        const [cookie] = response.headers['set-cookie']
        expect(cookie).toEqual(expect.stringContaining(regularUser.uid))
      })
    });
  });
});
