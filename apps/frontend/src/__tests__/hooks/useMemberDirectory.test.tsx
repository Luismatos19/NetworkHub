import { renderHook, waitFor, act } from "@testing-library/react";
import { useMemberDirectory } from "@/hooks/useMemberDirectory";

const getAllMembersMock = jest.fn();
const getMemberByEmailMock = jest.fn();

jest.mock("@/lib/api", () => ({
  referralsAPI: {
    getAllMembers: (...args: unknown[]) => getAllMembersMock(...args),
    getMemberByEmail: (...args: unknown[]) => getMemberByEmailMock(...args),
  },
}));

describe("useMemberDirectory", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should load members on mount", async () => {
    getAllMembersMock.mockResolvedValue([{ id: "member-1" }]);

    const { result } = renderHook(() => useMemberDirectory());

    await waitFor(() =>
      expect(result.current.members).toEqual([{ id: "member-1" }])
    );
  });

  it("should return member when searching by email", async () => {
    getAllMembersMock.mockResolvedValue([]);
    getMemberByEmailMock.mockResolvedValue({ id: "member-2" });

    const { result } = renderHook(() => useMemberDirectory());

    const member = await act(async () => {
      return await result.current.searchByEmail("user@example.com");
    });

    expect(member).toEqual({ id: "member-2" });
  });

  it("should set error when search fails", async () => {
    getAllMembersMock.mockResolvedValue([]);
    getMemberByEmailMock.mockRejectedValue(new Error("not-found"));

    const { result } = renderHook(() => useMemberDirectory());

    await act(async () => {
      await expect(
        result.current.searchByEmail("user@example.com")
      ).rejects.toThrow("not-found");
    });

    await waitFor(() => expect(result.current.error).toBe("not-found"));

    act(() => {
      result.current.clearError();
    });

    expect(result.current.error).toBe("");
  });
});

