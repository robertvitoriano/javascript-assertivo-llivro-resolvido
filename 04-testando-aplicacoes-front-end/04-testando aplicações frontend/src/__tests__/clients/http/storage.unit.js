import * as storage from "../../../clients/storage";
import { profile } from '../../../mocks/profile'

describe('Store', () => {
  const mockLocalstorage = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn()
  }
  
  it('Should be able to get data from store', () => {
    mockLocalstorage.getItem.mockReturnValueOnce(JSON.stringify(profile))

    const receivedValue = storage.getData({ client: mockLocalstorage })

    expect(mockLocalstorage.getItem).toBeCalledTimes(1)
    expect(mockLocalstorage.getItem).toBeCalledWith(storage.STORAGE_KEY)
    expect(receivedValue).toMatchObject(profile)
  })

  it('Should be able to remove Item from storage', () => {
    storage.removeData({ client: mockLocalstorage })

    expect(mockLocalstorage.removeItem).toBeCalledWith(storage.STORAGE_KEY)
    expect(mockLocalstorage.removeItem).toBeCalledTimes(1)
  })

});
