import * as auth from '../../../clients/http/authentication';
import * as storage from '../../../clients/storage';
import endpoints from '../../../clients/http/endpoints';
import { profile as mockProfile, profile } from './../../../mocks/profile';
jest.mock('../../../clients/storage.js');


describe('Authtentication Client', ()=>{
  it('Should perform a sucessfull login and store  user data locally', async ()=>{
    const client = {
      post:jest.fn().mockResolvedValue(mockProfile)
    }
    const password ='my-strong-password'
    const userResponse = await auth.logIn({
      username:mockProfile.userName,
      password,
      client
    })
    
    expect( client.post).toBeCalledTimes(1)
    expect(client.post).toBeCalledWith(endpoints.authentication, {password, username:profile.userName})
    
    expect(storage.setData).toBeCalledTimes(1)
    expect(storage.setData).toBeCalledWith({data:userResponse})
    
  })
})
