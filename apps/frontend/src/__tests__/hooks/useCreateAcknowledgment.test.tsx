import { renderHook, act, waitFor } from "@testing-library/react";
import { useCreateAcknowledgment } from "@/hooks/useCreateAcknowledgment";

const createAcknowledgmentMock = jest.fn();

jest.mock("@/lib/api", () => ({
  referralsAPI: {
    createAcknowledgment: (...args: unknown[]) =>
      createAcknowledgmentMock(...args),
  },
}));

describe("useCreateAcknowledgment", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should throw error when memberId is missing", async () => {
    const { result } = renderHook(() => useCreateAcknowledgment("", "ref-1"));

    await act(async () => {
      await expect(
        result.current.submit({ message: "thanks", isPublic: true })
      ).rejects.toThrow("member-id-missing");
    });

    await waitFor(() =>
      expect(result.current.error).toBe(
        "É necessário selecionar um membro antes de agradecer."
      )
    );
  });

  it("should call API when memberId is present", async () => {
    createAcknowledgmentMock.mockResolvedValue({});

    const { result } = renderHook(() =>
      useCreateAcknowledgment("member-1", "ref-1")
    );

    await act(async () => {
      await result.current.submit({ message: "thanks", isPublic: true });
    });

    expect(createAcknowledgmentMock).toHaveBeenCalledWith("member-1", "ref-1", {
      message: "thanks",
      isPublic: true,
    });
    expect(result.current.error).toBe("");
  });

  it("should expose error message when API call fails", async () => {
    createAcknowledgmentMock.mockRejectedValue(new Error("api-error"));

    const { result } = renderHook(() =>
      useCreateAcknowledgment("member-1", "ref-1")
    );

    await act(async () => {
      await expect(
        result.current.submit({ message: "thanks", isPublic: true })
      ).rejects.toThrow("api-error");
    });

    await waitFor(() =>
      expect(result.current.error).toBe("api-error")
    );

    act(() => {
      result.current.clearError();
    });
    expect(result.current.error).toBe("");
  });
});

