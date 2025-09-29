import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders VizAI header", () => {
  render(<App />);
  const header = screen.getByText(/VizAI/i);
  expect(header).toBeInTheDocument();
});
