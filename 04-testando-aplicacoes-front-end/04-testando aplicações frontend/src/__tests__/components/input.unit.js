import {screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithTheme } from '../../testUtils'
import Input from './../../components/input'

describe("<Input/>",()=>{
  it("should be able to render an Input that can be receive some text",()=>{
    renderWithTheme(<Input data-testid="input-test" />)
    const input = screen.getByTestId("input-test")
    expect(input).toBeInTheDocument()
    userEvent.type(input,"some text to be typed")
    expect(input).toHaveValue("some text to be typed")
  })
  it("should render a password input that can be",()=>{
    renderWithTheme(<Input type="password" placeholder="campo de senha"/>)
    const input = screen.getByPlaceholderText("campo de senha")
    expect(input).toBeInTheDocument()
    userEvent.type(input,"myPassword")
    expect(input).toHaveValue("myPassword")
    expect(input).toHaveAttribute('type','password')
    const button = screen.getByRole('button')
    userEvent.click(button)
    expect(input).toHaveAttribute('type', 'text')
  })
  it("should render a select with an array of options passed as props",()=>{
    const options = [
      {text:"first-option", value:"first-value"},
      {text:"second-option", value:"second-value"},
      {text:"third-option", value:"third-value"}
    ]
      renderWithTheme(<Input type="select" options={options} data-testid="select-test"/>)
      const select = screen.getByTestId('select-test')
      expect(select).toBeInTheDocument()
      expect(select).toMatchSnapshot()
      options.forEach(option =>{
        expect(screen.getByText(option.text)).toBeInTheDocument()
      })
      userEvent.selectOptions(select,"first-option")
      expect(select).toHaveValue("first-value")
    
  })
})
