import {screen, waitFor, within } from '@testing-library/react'
import {renderWithProviders} from '../../testUtils'
import userEvent from '@testing-library/user-event'
import { MESSAGES } from '../../store/notification/actions';
import DashboardPage from '../../pages/dashboard'

import {profile, profileList} from '../../mocks/profile'

import * as client from '../../clients/http/profiles';
import * as auth from '../../clients/http/authentication';

jest.mock('../../clients/http/profiles')
jest.mock('../../clients/http/authentication')

describe('Dashboard',()=>{
  beforeEach(()=>{
    client.getProfiles.mockResolvedValue(profileList)
    auth.isLoggedIn.mockResolvedValue(true)
  })
  describe('Role User', ()=>{
    beforeEach(()=>{
      auth.getLoggedUser.mockResolvedValueOnce(profile)
      renderWithProviders(<DashboardPage />);
    })
    
    it('Should render a full carrousel of profiles',async()=>{
      const items = await screen.findAllByRole('listitem');
      expect(items.length).toBe(profileList.length)
    })
    
    it('Should not allow admin actions for a user role',async ()=>{
      const createButton = await screen.findByLabelText('cadastrar')
      expect(createButton).toBeDisabled()
      userEvent.click(createButton)
      const modal = screen.queryByRole('dialog');
      expect(modal).not.toBeInTheDocument();
      const [editButton] = await screen.findAllByLabelText('editar')
      expect(editButton).toBeDisabled()      
      const [deleteButton] = await screen.findAllByLabelText('deletar')
      expect(deleteButton).toBeDisabled()
    })
  })
  
  describe('Role Admin',()=>{
    beforeEach(()=>{
      auth.getLoggedUser.mockReturnValue({
        ...profile,
        role:'ADMIN'
      })
      jest.useFakeTimers();
      renderWithProviders(<DashboardPage />);
    })
    afterEach(()=>{
      jest.useRealTimers()
    })
    
    it.each([
      ['creation', {buttonTitle:'cadastrar', modalTitle:'Criar dados de Perfil'}],
      ['edit', {buttonTitle:'editar', modalTitle:'Editar dados de Perfil'}]
    ])
    ('Should be able to open and close the user %s modal',async (_,{buttonTitle, modalTitle})=>{
      const [button] = await screen.findAllByLabelText(buttonTitle);
      expect(button).toBeInTheDocument()
      userEvent.click(button)
      expect(screen.queryByRole('dialog')).toBeInTheDocument()
      expect(screen.queryByText(modalTitle)).toBeInTheDocument()
      const fechar = screen.getByLabelText('fechar')
      userEvent.click(fechar)
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
      expect(screen.queryByText(modalTitle)).not.toBeInTheDocument()
    })
    
    it('Should be able to delete a user', async()=>{
      const items = await screen.findAllByRole('listitem');
      expect(items.length).toEqual(profileList.length);
      
      const [deleteButton] = await screen.findAllByLabelText('deletar')
      expect(deleteButton).toBeEnabled()
      const [firstProfile] = await screen.findAllByText(profileList[0].name + " " +profileList[0].lastName )
      expect(firstProfile).toBeInTheDocument()
      userEvent.click(deleteButton)
      //expect(firstProfile).not.toBeInTheDocument()
    })
    
    it('Should allow new user register', async ()=>{
      const newProfile = {
        ...profile,
        userName: 'username-qualquer',
        email: 'email@qualquer.com',
        password: 'senha secreta'
        };
        
        client.createProfile.mockResolvedValueOnce(newProfile)
        
        const createButton = await screen.findByLabelText('cadastrar')
        userEvent.click(createButton)
        
        userEvent.type(screen.getByPlaceholderText('usuario'), newProfile.userName)
        userEvent.type(screen.getByPlaceholderText('sua senha super secreta'), newProfile.password)
        userEvent.type(screen.getByPlaceholderText('email'), newProfile.email)
        userEvent.type(screen.getByPlaceholderText('nome'), newProfile.name)
        userEvent.type(screen.getByPlaceholderText('sobrenome'), newProfile.lastName)
        userEvent.selectOptions(screen.getByPlaceholderText('role'), screen.getByText('Usuário'))
        userEvent.click(screen.getByText('Confirmar'))
        await waitFor(async()=>{
          const items = await screen.findAllByRole('listitem') || []
          expect(items.length).toBe(profileList.length + 1)
        })
        
       const items = await screen.queryAllByRole('listitem')
       const lastItem = items[items.length - 1]
       const queries = within(lastItem)
       expect(queries.getByText(newProfile.userName)).toBeInTheDocument()
       expect(queries.getByText(newProfile.email)).toBeInTheDocument()
       
       await waitFor(()=>{
        jest.runOnlyPendingTimers()
        expect(screen.getByText(MESSAGES.CREATE.SUCCESS)).toBeInTheDocument()
        jest.runAllTimers()
       })
        
    })
    it('Should throw an error if cannot register user', async ()=>{
      const newProfile = {
        ...profile,
        userName: 'username-qualquer',
        email: 'email@qualquer.com',
        password: 'senha secreta'
        };
        client.createProfile.mockRejectedValueOnce(MESSAGES.CREATE.ERROR)
        
        const createButton = await screen.findByLabelText('cadastrar')
        userEvent.click(createButton)
        
        userEvent.type(screen.getByPlaceholderText('usuario'), newProfile.userName)
        userEvent.type(screen.getByPlaceholderText('sua senha super secreta'), newProfile.password)
        userEvent.type(screen.getByPlaceholderText('email'), newProfile.email)
        userEvent.type(screen.getByPlaceholderText('nome'), newProfile.name)
        userEvent.type(screen.getByPlaceholderText('sobrenome'), newProfile.lastName)
        userEvent.selectOptions(screen.getByPlaceholderText('role'), screen.getByText('Usuário'))
        userEvent.click(screen.getByText('Confirmar'))
        await waitFor(async()=>{
          const items = await screen.findAllByRole('listitem') || []
          expect(items.length).toBe(profileList.length)
        })
        
       expect(screen.queryByText(newProfile.userName)).not.toBeInTheDocument()
       expect(screen.queryByText(newProfile.email)).not.toBeInTheDocument()
       
       await waitFor(()=>{
        jest.runOnlyPendingTimers()
        expect(screen.getByText('Ocorreu um erro ao criar o perfil')).toBeInTheDocument()
        jest.runAllTimers()
       })  
    })
  })

})
