import { render, screen, fireEvent } from "@testing-library/react";
import AdminSecretForm from "@/components/participation-intentions/AdminSecretForm";

describe("AdminSecretForm", () => {
  it("should render default value and submit secret", () => {
    const onSubmit = jest.fn();

    render(
      <AdminSecretForm defaultValue="existing" onSubmit={onSubmit} />
    );

    const input = screen.getByPlaceholderText("Digite o admin secret");
    expect(input).toHaveValue("existing");

    fireEvent.change(input, { target: { value: "new-secret" } });
    fireEvent.submit(screen.getByRole("button", { name: /acessar/i }));

    expect(onSubmit).toHaveBeenCalledWith("new-secret");
  });

  it("should display error message when provided", () => {
    render(
      <AdminSecretForm
        defaultValue=""
        onSubmit={jest.fn()}
        error="Credencial inválida"
      />
    );

    expect(screen.getByText("Credencial inválida")).toBeInTheDocument();
  });
});

