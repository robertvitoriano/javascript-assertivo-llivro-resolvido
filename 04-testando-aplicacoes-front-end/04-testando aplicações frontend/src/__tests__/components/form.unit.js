import { renderWithTheme } from './../../testUtils';
import schema from '../../pages/login/schema';
import { screen, waitFor } from '@testing-library/react';
import Form from '../../components/form';

describe('<Form/>', () => {
  it('form should be visible when rendered', async () => {
    renderWithTheme(<Form role={'user'} schema={schema} />);
    await waitFor(() => {
      const form = screen.getByTestId('form-component');
      expect(form).toBeVisible();
    });
    const form = screen.getByTestId('form-component');

    expect(form).toBeVisible();
  });

  it('Should render login form successfully', async () => {
    renderWithTheme(<Form role={'user'} schema={schema} />);

    const form = screen.getByTestId('form-component');

    const inputs = form.querySelectorAll("input");
    expect(inputs.length).toBe(2);

    schema.fields.forEach((field, index) => {
      const inputName = inputs[index].getAttribute('name');
      const inputPlaceholder = inputs[index].getAttribute('placeholder');

      expect(inputs[index].type).toBe(field.type);
      expect(inputName).toBe(field.name);
      expect(inputPlaceholder).toBe(field.placeholder);
    });
  });
});
