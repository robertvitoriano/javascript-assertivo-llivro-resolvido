import { isAdminMiddleware } from "../../src/middlewares";
import ROLES from "../../src/constants/roles";

// mock user
const mockUser = {
  uid: 'abc-1234',
  userName: 'nomeDeUsuario',
  name: 'nome',
  lastName: 'DeUsuario',
  email: 'email.nome@usuario.com',
  password: 'senhasupersecreta',
  };


  it('Should return user data if role is ADMIN',() =>{
    const mockAdmin = {
      user:{
        ...mockUser,
        role:ROLES.ADMIN
      }
    }

    const result = isAdminMiddleware(mockAdmin)
    expect(result).toEqual(mockAdmin)
})

it('Should throw an error if user is not admin', () =>{

  const notAdminUserMock = {
    user:{
      ...mockUser,
      role:ROLES.USER
    }
  }
  const result = () => isAdminMiddleware(notAdminUserMock)
  expect(result).toThrow('Você não possui permissão para executar essa operação.')
})
