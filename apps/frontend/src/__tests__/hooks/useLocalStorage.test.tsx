import { renderHook, act } from "@testing-library/react";
import { useLocalStorage } from "@/hooks/useLocalStorage";

describe("useLocalStorage", () => {
  const KEY = "test-key";

  beforeEach(() => {
    window.localStorage.clear();
  });

  it("should return initial value when localStorage is empty", () => {
    const { result } = renderHook(() => useLocalStorage(KEY, "initial"));
    expect(result.current[0]).toBe("initial");
  });

  it("should read an existing value from localStorage", () => {
    window.localStorage.setItem(KEY, JSON.stringify("persisted"));

    const { result } = renderHook(() => useLocalStorage(KEY, "initial"));

    expect(result.current[0]).toBe("persisted");
  });

  it("should update state and localStorage when setter is called", () => {
    const { result } = renderHook(() => useLocalStorage(KEY, "initial"));

    act(() => {
      result.current[1]("changed");
    });

    expect(result.current[0]).toBe("changed");
    expect(window.localStorage.getItem(KEY)).toBe(
      JSON.stringify("changed")
    );
  });

  it("should remove value when remove function is called", () => {
    const { result } = renderHook(() => useLocalStorage(KEY, "initial"));

    act(() => {
      result.current[1]("another");
    });
    act(() => {
      result.current[2]();
    });

    expect(result.current[0]).toBe("initial");
    expect(window.localStorage.getItem(KEY)).toBeNull();
  });
});

