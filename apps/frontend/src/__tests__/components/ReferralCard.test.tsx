import { render, screen, fireEvent } from "@testing-library/react";
import ReferralCard from "@/components/referrals/ReferralCard";

const referral = {
  id: "ref-1",
  title: "Nova parceria",
  description: "Detalhes da indicação",
  status: "pending",
  value: 1000,
  createdAt: new Date().toISOString(),
  referrer: { id: "member-1", name: "Alice" },
  referred: { id: "member-2", name: "Bob" },
};

describe("ReferralCard", () => {
  it("should display referral information", () => {
    render(
      <ReferralCard
        referral={referral}
        memberId="member-2"
        onUpdateStatus={jest.fn()}
      />
    );

    expect(screen.getByText("Nova parceria")).toBeInTheDocument();
    expect(screen.getByText(/Detalhes da indicação/)).toBeInTheDocument();
    expect(screen.getByText("pending")).toBeInTheDocument();
  });

  it("should trigger status update when changed", () => {
    const onUpdateStatus = jest.fn();

    render(
      <ReferralCard
        referral={referral}
        memberId="member-2"
        onUpdateStatus={onUpdateStatus}
      />
    );

    fireEvent.change(screen.getByDisplayValue("Pendente"), {
      target: { value: "closed" },
    });

    expect(onUpdateStatus).toHaveBeenCalledWith("ref-1", "closed");
  });

  it("should hide controls when user is not referred", () => {
    render(
      <ReferralCard
        referral={referral}
        memberId="others"
        onUpdateStatus={jest.fn()}
      />
    );

    expect(
      screen.queryByDisplayValue("Pendente")
    ).not.toBeInTheDocument();
  });
});

