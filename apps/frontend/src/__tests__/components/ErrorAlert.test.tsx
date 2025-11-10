import { render, screen, fireEvent } from "@testing-library/react";
import ErrorAlert from "@/components/common/ErrorAlert";

describe("ErrorAlert", () => {
  it("should not render when message is empty", () => {
    const { container } = render(<ErrorAlert message="" />);
    expect(container.firstChild).toBeNull();
  });

  it("should render message and handle close action", () => {
    const onClose = jest.fn();
    render(<ErrorAlert message="Something went wrong" onClose={onClose} />);

    expect(
      screen.getByText("Something went wrong")
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /fechar/i }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});

