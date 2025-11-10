import { renderHook, act } from "@testing-library/react";
import { useAdminSecret } from "@/hooks/useAdminSecret";

describe("useAdminSecret", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("should start without secret", () => {
    const { result } = renderHook(() => useAdminSecret());
    expect(result.current.adminSecret).toBe("");
    expect(result.current.hasSecret).toBe(false);
  });

  it("should persist secret and reflect hasSecret", () => {
    const { result } = renderHook(() => useAdminSecret());

    act(() => {
      result.current.persistSecret("  secret-value  ");
    });

    expect(result.current.adminSecret).toBe("secret-value");
    expect(result.current.hasSecret).toBe(true);
    expect(window.localStorage.getItem("admin_secret")).toBe(
      JSON.stringify("secret-value")
    );
  });

  it("should clear secret", () => {
    const { result } = renderHook(() => useAdminSecret());

    act(() => {
      result.current.persistSecret("secret-value");
    });
    act(() => {
      result.current.clearSecret();
    });

    expect(result.current.adminSecret).toBe("");
    expect(result.current.hasSecret).toBe(false);
    expect(window.localStorage.getItem("admin_secret")).toBeNull();
  });
});

