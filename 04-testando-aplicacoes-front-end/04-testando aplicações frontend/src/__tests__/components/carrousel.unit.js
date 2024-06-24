import {screen} from '@testing-library/react'
import {renderWithTheme} from '../../testUtils'
import Carrousel from './../../components/carousel'

jest.mock('../../components/profile',() =>() =><div data-testid="profile"/>)

const BASE_PROPS ={
  onClickDelete: jest.fn(),
  onClickEdit: jest.fn(),
  editable: true
}
describe('<Carrousel/>',()=>{
  it('Deve renderizar uma lista de perfis',()=>{
    const items =[
      {name:'primeiro'},
      {name:'segundo'},
      {name:'terceiro'}
    ]
    renderWithTheme(<Carrousel items={items} {...BASE_PROPS}/>)
    
    const list = screen.getByRole('list');
    const profiles = screen.getAllByTestId('profile')
    const buttons = screen.getAllByRole('button')
    
    expect(list).toBeInTheDocument()
    expect(profiles.length).toEqual(3)
    expect(buttons.length).toEqual(2)

  })
})

