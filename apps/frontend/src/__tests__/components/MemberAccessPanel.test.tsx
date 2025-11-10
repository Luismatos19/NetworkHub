import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import MemberAccessPanel from "@/components/referrals/MemberAccessPanel";

const defaultProps = {
  members: [
    { id: "member-1", name: "Alice", company: "ACME", user: { email: "a@b.com" } },
  ],
  isLoadingMembers: false,
  isSearching: false,
  error: "",
  onDismissError: jest.fn(),
  onSelectMember: jest.fn(),
  onSearchByEmail: jest.fn(),
};

describe("MemberAccessPanel", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should trigger email search and select member", async () => {
    const onSearchByEmail = jest.fn().mockResolvedValue({ id: "member-2" });
    const onSelectMember = jest.fn();

    render(
      <MemberAccessPanel
        {...defaultProps}
        onSearchByEmail={onSearchByEmail}
        onSelectMember={onSelectMember}
      />
    );

    fireEvent.change(
      screen.getByPlaceholderText("Digite seu email cadastrado"),
      { target: { value: "user@example.com" } }
    );
    fireEvent.click(screen.getByRole("button", { name: /buscar/i }));

    await waitFor(() => expect(onSearchByEmail).toHaveBeenCalled());
    expect(onSearchByEmail).toHaveBeenCalledWith("user@example.com");
    expect(onSelectMember).toHaveBeenCalledWith("member-2");
  });

  it("should select member from list", () => {
    const onSelectMember = jest.fn();
    render(
      <MemberAccessPanel
        {...defaultProps}
        onSelectMember={onSelectMember}
        onSearchByEmail={jest.fn()}
      />
    );

    fireEvent.click(screen.getByText("Alice"));
    expect(onSelectMember).toHaveBeenCalledWith("member-1");
  });

  it("should submit manual member id", () => {
    const onSelectMember = jest.fn();
    render(
      <MemberAccessPanel
        {...defaultProps}
        onSelectMember={onSelectMember}
        onSearchByEmail={jest.fn()}
      />
    );

    fireEvent.change(
      screen.getByPlaceholderText("Digite o Member ID"),
      { target: { value: "member-3" } }
    );
    fireEvent.submit(screen.getByRole("button", { name: /acessar/i }));

    expect(onSelectMember).toHaveBeenCalledWith("member-3");
  });

  it("should display error message", () => {
    render(
      <MemberAccessPanel
        {...defaultProps}
        error="Erro ao buscar membro"
        onSearchByEmail={jest.fn()}
      />
    );

    expect(screen.getByText("Erro ao buscar membro")).toBeInTheDocument();
  });
});

