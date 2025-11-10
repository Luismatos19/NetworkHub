import { render, screen, fireEvent } from "@testing-library/react";
import ReferralFilters from "@/components/referrals/ReferralFilters";

describe("ReferralFilters", () => {
  it("should call callbacks on change and refresh", () => {
    const onFilterChange = jest.fn();
    const onRefresh = jest.fn();

    render(
      <ReferralFilters
        filter={{ type: "sent", status: "pending" }}
        onFilterChange={onFilterChange}
        onRefresh={onRefresh}
        isLoading={false}
      />
    );

    fireEvent.change(screen.getByDisplayValue("Enviadas"), {
      target: { value: "" },
    });
    expect(onFilterChange).toHaveBeenCalledWith("type", undefined);

    fireEvent.click(screen.getByRole("button", { name: /atualizar/i }));
    expect(onRefresh).toHaveBeenCalled();
  });
});

