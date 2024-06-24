import { createUser } from '../../../src/database/user/create'
import * as file from '../../../src/database/file'
import ROLES from '../../../src/constants/roles.js'
jest.mock('../../../src/database/file.js')
jest.mock('../../../src/database/path.js')

const user = {
  email:'any@email.com',
  password:'senha1234',
  username:'qualquerUsuário',
  name:'USERMaster',
  lastName:'LASTNAME'

}

afterEach(()=>{
  jest.clearAllMocks()
})

beforeEach(()=>{
  file.loadDatabase.mockResolvedValueOnce([]);
})

afterAll(()=>{
  jest.restoreAllMocks()
})

it('creates user correctly', async() => {
  expect.assertions(4)
  file.loadDatabase.mockResolvedValueOnce([]);

  const newUser = await createUser(user);

  expect(file.loadDatabase).toHaveBeenCalledTimes(1);
  expect(file.saveDatabase).toHaveBeenCalledTimes(1);
  expect(file.saveDatabase).toHaveBeenCalledWith([newUser]);

  expect(newUser).toEqual({
    ...user,
    uid: expect.any(String),
    role: ROLES.USER
    })
  });

it('creates an user with an admin role correctly', async() => {
  file.loadDatabase.mockResolvedValueOnce([]);
  expect.assertions(3);
  const newUser = await createUser({
    ...user,
    role: ROLES.ADMIN
  })
  expect(file.loadDatabase).toHaveBeenCalledTimes(1);
  expect(file.saveDatabase).toHaveBeenCalledTimes(1);
  expect(file.saveDatabase).toHaveBeenCalledWith([newUser]);

})

it('Deve conter pelo menos 1 asserção', async() => {
  expect.assertions(1);
  await Promise.resolve(1);
  expect(2+52).toBe(54)
  });
