import { screen, } from "@testing-library/react";
import { renderWithTheme } from "../../testUtils";
import Card from "../../components/card";
import theme from './../../styles/theme';

describe("<Card/>", () => {
  it.each([
    [''],
    ['half'],
    ['default'],
    ['onehalf'],
    ['double'],
    ['triple'],
    ['quadruple']
  ])(
    "Should be able to render card component with correct spacing when '%s' value is given to the 'spacing' prop",
    (spacing) => {
      renderWithTheme(<Card spacing={spacing} />);
      const card = screen.getByTestId('card-component');
      expect(card).toBeVisible();
      expect(card).toHaveStyle(`
        overflow: hidden;
        border-radius: ${theme.radius.default};
        padding: ${!!spacing && theme.spacing[spacing]};
        box-shadow: ${theme.shadow.light};
        background: ${theme.colors.white};
      `);
    }
  );
});

