import { render, screen, waitFor, waitForElementToBeRemoved } from '@testing-library/react'
import Snackbar from '../../components/snackbar'
import { renderWithTheme, waitTimersByTime } from '../../testUtils'
import userEvent from '@testing-library/user-event'
describe("<Snackbar/>",()=>{
  beforeEach(()=>{
    jest.useFakeTimers()
  })
  afterEach(() => {
    jest.useRealTimers();
    });
    
  it("should render snackbar", async ()=>{
    renderWithTheme(<Snackbar >mensagem</Snackbar>)
    const snackbar = screen.getByText("mensagem")
    expect(snackbar).toBeInTheDocument()
    expect(snackbar).not.toBeVisible()
    
    await  waitTimersByTime(500)
    
    expect(snackbar).toBeVisible()

    await  waitTimersByTime(5000)
    
    expect(snackbar).not.toBeVisible()
    await  waitTimersByTime(500)
    expect(snackbar).not.toBeInTheDocument()
  })
})
it("should remove snackbar component from screen on click",async()=>{
  renderWithTheme(<Snackbar >mensagem</Snackbar>)
  const snackbarButton = screen.getByRole("button")
  const snackbar = screen.getByText("mensagem")
  expect(snackbar).toBeInTheDocument()
  userEvent.click(snackbarButton)
  await waitForElementToBeRemoved(()=>screen.queryByText("mensagem"))

})

