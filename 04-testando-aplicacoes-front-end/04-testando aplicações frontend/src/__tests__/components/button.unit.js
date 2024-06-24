import {screen} from "@testing-library/react"
import userEvent from '@testing-library/user-event'
import Button from '../../components/button'
import { renderWithTheme } from "../../testUtils"
describe("<Button/>",()=>{
  it("Renderiza um botão corretamente", ()=>{
    renderWithTheme(<Button >something</Button>)
    const button =  screen.getByRole("button")
    expect(button).toBeInTheDocument()
    expect(button).toMatchSnapshot()
  })
  it("fires some click actions once it receives a function as prop",()=>{
    const testFunction = jest.fn()
    renderWithTheme(<Button onClick={testFunction}>Some text</Button>)
    const button = screen.getByRole("button")
    userEvent.click(button)
    expect(testFunction).toBeCalledTimes(1)    
  })
  
  it("Pode renderizar um ícone",()=>{
    const icon = <span>Some Icon</span>
    renderWithTheme(<Button icon={icon}>Some text</Button>)
    const iconFound = screen.getByText('Some Icon')
    expect(iconFound).toBeInTheDocument()
  })
})

//página 250
