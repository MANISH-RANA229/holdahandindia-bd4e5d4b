/**
 * useThrottle — Returns a throttled callback that fires at most once
 * per `delay` milliseconds. Useful for rate-limiting chat sends and
 * session requests on the client side.
 */
import { useRef, useCallback } from "react";

export function useThrottle<T extends (...args: any[]) => void>(
  callback: T,
  delay: number
): T {
  const lastCall = useRef(0);

  return useCallback(
    ((...args: any[]) => {
      const now = Date.now();
      if (now - lastCall.current >= delay) {
        lastCall.current = now;
        callback(...args);
      }
    }) as T,
    [callback, delay]
  );
}
