import * as profileService from '../../../clients/http/profiles'
import * as storage from './../../../clients/storage';
import endpoints from '../../../clients/http/endpoints';
import { profileList as mockProfiles, profile as mockProfile, profile} from '../../../mocks/profile';
jest.mock("../../../clients/storage.js")

const mockClient = {
  post: jest.fn(),
  get: jest.fn(),
  delete: jest.fn(),
  patch: jest.fn()
}
describe("Profiles",()=>{
  it("Should be able to get profile information", async ()=>{
    const {uid, ...rest} = mockProfile
    
    mockClient.post.mockResolvedValueOnce(mockProfile)
    
    const createdProfile = await profileService.createProfile({client:mockClient,information:rest})
    
    expect(mockClient.post).toBeCalledTimes(1)
    expect(mockClient.post).toBeCalledWith(endpoints.user, rest)
    
    expect(createdProfile).toMatchObject(mockProfile)
  })
  it('Should be able to get all created users',async()=>{

    mockClient.get.mockResolvedValueOnce(mockProfiles)

    const profilesRetrieved = await profileService.getProfiles({client:mockClient})
    
    expect(mockClient.get).toBeCalledTimes(1)
    expect(mockClient.get).toBeCalledWith(endpoints.users)
    
    expect(profilesRetrieved).toEqual(mockProfiles)
  })
  it('Should be able to delete a user', async()=>{
    await profileService.deleteProfile({client:mockClient,uid:mockProfile.uid})
    
    expect(mockClient.delete).toBeCalledTimes(1)
    expect(mockClient.delete).toBeCalledWith(endpoints.user,{data:{uid:mockProfile.uid}})
  })
  
  it('Should be able to update a user', async ()=>{
    const newName = 'Ronaldo'
    mockClient.patch.mockResolvedValueOnce({...mockProfile, name:newName})
    const updatedProfile = await profileService.updateProfile({client:mockClient, uid:mockProfile.uid, information:{name:newName}})
    expect(mockClient.patch).toBeCalledTimes(1)
    expect(mockClient.patch).toBeCalledWith(endpoints.user,{information:{name:newName}, uid:mockProfile.uid})
    expect(updatedProfile).toMatchObject({...mockProfile, name:newName})
    
  })
})
