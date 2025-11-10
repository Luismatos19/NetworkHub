import { render, screen, fireEvent } from "@testing-library/react";
import IntentionCard from "@/components/participation-intentions/IntentionCard";

const baseIntention = {
  id: "int-1",
  name: "Jane Doe",
  email: "jane@example.com",
  status: "pending",
  createdAt: new Date().toISOString(),
};

describe("IntentionCard", () => {
  it("should render intention information", () => {
    render(
      <IntentionCard
        intention={baseIntention}
        onApprove={jest.fn()}
        onReject={jest.fn()}
      />
    );

    expect(screen.getByText("Jane Doe")).toBeInTheDocument();
    expect(screen.getByText("jane@example.com")).toBeInTheDocument();
    expect(screen.getByText("pending")).toBeInTheDocument();
  });

  it("should call callbacks when approving or rejecting", () => {
    const onApprove = jest.fn();
    const onReject = jest.fn();

    render(
      <IntentionCard
        intention={baseIntention}
        onApprove={onApprove}
        onReject={onReject}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /aprovar/i }));
    fireEvent.click(screen.getByRole("button", { name: /recusar/i }));

    expect(onApprove).toHaveBeenCalledWith("int-1");
    expect(onReject).toHaveBeenCalledWith("int-1");
  });

  it("should hide action buttons when intention is not pending", () => {
    render(
      <IntentionCard
        intention={{ ...baseIntention, status: "approved" }}
        onApprove={jest.fn()}
        onReject={jest.fn()}
      />
    );

    expect(
      screen.queryByRole("button", { name: /aprovar/i })
    ).not.toBeInTheDocument();
  });
});

