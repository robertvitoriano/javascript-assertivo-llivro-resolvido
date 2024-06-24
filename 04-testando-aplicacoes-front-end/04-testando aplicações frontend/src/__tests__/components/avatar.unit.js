import { renderWithTheme } from "../../testUtils";
import Avatar from "../../components/avatar";
import { screen } from "@testing-library/react";
import theme from './../../styles/theme';

describe("<Avatar/>", () => {
  test.each([
    ['', false],
    ['http://someimage.com', false],
    ['', true],
    ['http://someimage.com', true],
  ])(
    'Should render the avatar correctly with %s src and minimal=%s',
    (src, minimal) => {
      const props = {
        src,
        minimal
      };

      renderWithTheme(<Avatar {...props} />);

      const avatar = screen.getByRole('figure');
      const avatarMissingIcon = screen.queryByTestId('avatar-missing-icon');

      if (avatarMissingIcon) {
        expect(avatar).toBeVisible();
        expect(avatarMissingIcon).toBeVisible();
      }

      if (minimal) {
        expect(avatar).toHaveStyle(`
          overflow: hidden;
          width: ${theme.spacing.double};
          height: ${theme.spacing.double};
          border-radius: ${theme.radius.rounded};
        `);
      }

      if (src) {
        const image = screen.getByRole('img');
        expect(image).toBeVisible();
      } else {
        expect(screen.queryByRole('img')).not.toBeInTheDocument();
      }
    }
  );
});
