import { screen } from "@testing-library/react";
import { render } from "../../test-utils";
import Form from './Form'

it("renders without crashing", () => {
  render(<Form />);
});

it('renders a title', () => {
  render(<Form />);
  expect(screen.getByTestId('form-title')).toBeInTheDocument()
})
