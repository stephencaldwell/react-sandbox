import { useState } from "react";

export function useLoading<T extends any[], TResult>(
  f: (...args: T) => Promise<TResult>
): [boolean, (...args: T) => Promise<TResult>] {
  const [isLoading, setIsLoading] = useState(false);
  const wrappedFunction = async (...args: T) => {
    setIsLoading(false);
    try {
      const response = await f(...args);
      return response;
    } finally {
      setIsLoading(false);
    }
  };

  return [isLoading, wrappedFunction];
}

export function useLoadingTimeout<T extends any[], TResult>(
  f: (...args: T) => Promise<TResult>
): [boolean, (...args: T) => Promise<TResult>] {
  const [isLoading, setIsLoading] = useState(false);
  const wrappedFunction = (...args: T) => {
    return new Promise<TResult>((resolve, reject) => {
      setIsLoading(true);
      setTimeout(() =>
        f(...args)
          .then(resolve)
          .catch(reject)
          .finally(() => setIsLoading(false))
      );
    });
  };
  return [isLoading, wrappedFunction];
}
