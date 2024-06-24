import { renderWithTheme } from "../../testUtils";
import { screen } from "@testing-library/react";
import Profile from "../../components/profile";
import userEvent from "@testing-library/user-event";
describe("<Profile/>", () => {
  const requiredProps = {
    email: "robertvitoriano@gmail.com",
    userName: "robertvitoriano",
    name: "robert",
    lastName: "vitoriano",
    avatar: "some-avatar",
    role: "master",
    uid: "some-randomuuid",
  };
  it("Should be able to render Profile component correctly when all required props are provided", () => {
    renderWithTheme(<Profile {...requiredProps} />);
    const profile = screen.getByTestId("profile-component");
    expect(profile).toBeInTheDocument();
    expect(profile).toBeVisible();
  });
  it.each([
    ["email"],
    ["userName"],
    ["name"],
    ["name"],
    ["lastName"],
    ["avatar"],
    ["role"],
    ["uid"],
  ])(
    "Should be able to render profile component if %s is not provided",
    (requiredProp) => {
          delete requiredProps[requiredProp]
          renderWithTheme(<Profile {...requiredProps}/>)
          const profile = screen.queryByTestId('profile-component')
          expect(profile).toBeInTheDocument()
          expect(profile).toBeVisible()
    }
  );
  it.each([["true",{value:true, times:1, called:requiredProps.uid}], ["false",{value:false, times:0, requiredProps:''}]])
  ('tests click and edit button when editable prop is %s',(_,editInfo)=>{
    
    Object.assign(requiredProps,{onClickEdit: jest.fn(), onClickDelete: jest.fn(), editable:editInfo.value})
    
    renderWithTheme(<Profile {...requiredProps}/>)
        
    const buttons = screen.getAllByRole('button')
    
    buttons.forEach((button)=>{
      expect(button).toBeVisible()
    })
    
    const [editButton, deleteButton] = buttons
        
    userEvent.click(editButton)
    expect(requiredProps.onClickEdit).toBeCalledTimes(editInfo.times)
    
    userEvent.click(deleteButton)
    expect(requiredProps.onClickDelete).toBeCalledTimes(editInfo.times)
    
    if(editInfo.times > 0) {
      expect(requiredProps.onClickEdit).toBeCalledWith(requiredProps.uid)
      expect(requiredProps.onClickDelete).toBeCalledWith(requiredProps.uid)
    }
    
  })
});
