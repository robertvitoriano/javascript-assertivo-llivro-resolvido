import { getUserByUid } from '../../../src/database/user/read'
import { loadDatabase } from '../../../src/database/file.js';
jest.mock('../../../src/database/file.js')
jest.mock('../../../src/database/path.js')

const mockUser = {
  uid:'abc-1234',
  username:'nomeDeUsuario',
  name:'nome',
  lastName:'DeUsuario',
  email:'email.nome@usuario.com',
  password: 'senhasupersecreta',
  role:'USER'
}
loadDatabase.mockResolvedValue([mockUser])

it('finds user when existing user uuid is given', async ()=>{
  expect.assertions(1)
  const foundUser = await getUserByUid(mockUser.uid);
  expect(foundUser).toEqual(mockUser)
})

it('throws an error when user is not found', async () =>{
  expect.assertions(1)
  try {
    await getUserByUid('user-that-doesnt-exist')
  } catch (error) {
    expect(error.message).toEqual("Não existe usuário com uid informado.")
  }
})
