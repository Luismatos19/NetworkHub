import { renderHook, act } from "@testing-library/react";
import { useMemberSession } from "@/hooks/useMemberSession";

describe("useMemberSession", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("should expose empty member when none stored", () => {
    const { result } = renderHook(() => useMemberSession());
    expect(result.current.memberId).toBe("");
    expect(result.current.hasMember).toBe(false);
  });

  it("should persist member id", () => {
    const { result } = renderHook(() => useMemberSession());

    act(() => {
      result.current.persistMemberId("member-1");
    });

    expect(result.current.memberId).toBe("member-1");
    expect(result.current.hasMember).toBe(true);
  });

  it("should clear member id", () => {
    const { result } = renderHook(() => useMemberSession());

    act(() => {
      result.current.persistMemberId("member-1");
    });
    act(() => {
      result.current.clearMemberId();
    });

    expect(result.current.memberId).toBe("");
    expect(result.current.hasMember).toBe(false);
  });
});

