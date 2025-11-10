import { renderHook, act, waitFor } from "@testing-library/react";
import { useParticipationIntentions } from "@/hooks/useParticipationIntentions";

const listMock = jest.fn();
const approveMock = jest.fn();
const rejectMock = jest.fn();

jest.mock("@/lib/api", () => ({
  participationIntentionsAPI: {
    list: (...args: unknown[]) => listMock(...args),
    approve: (...args: unknown[]) => approveMock(...args),
    reject: (...args: unknown[]) => rejectMock(...args),
  },
}));

describe("useParticipationIntentions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should fetch intentions on mount when admin secret is provided", async () => {
    listMock.mockResolvedValue({ data: [{ id: "1", status: "pending" }] });

    const { result } = renderHook(() => useParticipationIntentions("secret"));

    await waitFor(() =>
      expect(result.current.intentions).toEqual([{ id: "1", status: "pending" }])
    );
    expect(listMock).toHaveBeenCalledWith("secret", undefined);
  });

  it("should expose error when fetch fails", async () => {
    listMock.mockRejectedValue(new Error("load-error"));

    const { result } = renderHook(() => useParticipationIntentions("secret"));

    await waitFor(() =>
      expect(result.current.error).toBe("load-error")
    );

    act(() => {
      result.current.clearError();
    });
    expect(result.current.error).toBe("");
  });

  it("should approve intention and refresh list", async () => {
    listMock.mockResolvedValue({ data: [{ id: "1", status: "pending" }] });
    approveMock.mockResolvedValue({});

    const { result } = renderHook(() => useParticipationIntentions("secret"));

    await waitFor(() => expect(listMock).toHaveBeenCalledTimes(1));

    await act(async () => {
      await result.current.approve("1");
    });

    expect(approveMock).toHaveBeenCalledWith("1", "secret");
    expect(listMock).toHaveBeenCalledTimes(2);
  });

  it("should reject intention and refresh list", async () => {
    listMock.mockResolvedValue({ data: [{ id: "1", status: "pending" }] });
    rejectMock.mockResolvedValue({});

    const { result } = renderHook(() => useParticipationIntentions("secret"));

    await waitFor(() => expect(listMock).toHaveBeenCalledTimes(1));

    await act(async () => {
      await result.current.reject("1");
    });

    expect(rejectMock).toHaveBeenCalledWith("1", "secret");
    expect(listMock).toHaveBeenCalledTimes(2);
  });
});

