import { renderHook, act, waitFor } from "@testing-library/react";
import { useReferrals } from "@/hooks/useReferrals";

const listMock = jest.fn();
const updateStatusMock = jest.fn();

jest.mock("@/lib/api", () => ({
  referralsAPI: {
    list: (...args: unknown[]) => listMock(...args),
    updateStatus: (...args: unknown[]) => updateStatusMock(...args),
  },
}));

describe("useReferrals", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should fetch referrals when memberId is provided", async () => {
    listMock.mockResolvedValue({ data: [{ id: "ref-1", status: "pending" }] });

    const { result } = renderHook(() => useReferrals("member-1"));

    await waitFor(() =>
      expect(result.current.referrals).toEqual([
        { id: "ref-1", status: "pending" },
      ])
    );

    expect(listMock).toHaveBeenCalledWith("member-1", undefined, undefined);
  });

  it("should update filters and refetch data", async () => {
    listMock.mockResolvedValue({ data: [] });

    const { result } = renderHook(() => useReferrals("member-1"));

    await waitFor(() => expect(listMock).toHaveBeenCalledTimes(1));

    act(() => {
      result.current.updateFilter("status", "pending");
    });

    await waitFor(() =>
      expect(listMock).toHaveBeenLastCalledWith(
        "member-1",
        undefined,
        "pending"
      )
    );
  });

  it("should update status and refresh referrals", async () => {
    listMock.mockResolvedValue({ data: [] });
    updateStatusMock.mockResolvedValue({});

    const { result } = renderHook(() => useReferrals("member-1"));

    await waitFor(() => expect(listMock).toHaveBeenCalledTimes(1));

    await act(async () => {
      await result.current.updateStatus("ref-1", "closed");
    });

    expect(updateStatusMock).toHaveBeenCalledWith(
      "member-1",
      "ref-1",
      "closed"
    );
    expect(listMock).toHaveBeenCalledTimes(2);
  });
});

