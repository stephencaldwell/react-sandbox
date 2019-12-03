import { useState } from "react";

export function useLoading<T extends any[], TResult>(
  f: (...args: T) => Promise<TResult>
): [boolean, (...args: T) => Promise<TResult>] {
  const [isLoading, setIsLoading] = useState(false);
  const wrappedFunction = async (...args: T) => {
    console.log("setting isLoading to true (no setTimeout)");
    setIsLoading(false);
    try {
      const response = await f(...args);
      return response;
    } finally {
      console.log("setting isLoading to false (no setTimeout)");
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
      console.log("setting isLoading to true (setTimeout)");
      setIsLoading(true);
      setTimeout(() =>
        f(...args)
          .then(resolve)
          .catch(reject)
          .finally(() => {
            console.log("setting isLoading to false (setTimeout)");
            setIsLoading(false);
          })
      );
    });
  };
  return [isLoading, wrappedFunction];
}
