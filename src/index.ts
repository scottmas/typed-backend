import { UnwrapPromise } from "./utils/typescript-utils";
export function createTypedBackendForClient<
  T extends DeepAsyncRecord<T>
>(): TypedApi<T> {
  return null as any;
}

type AsyncFn = (...args: any[]) => Promise<any>;

type DeepAsyncRecord<T extends {}> = {
  [key in keyof T]: T[key] extends AsyncFn ? T[key] : DeepAsyncRecord<T[key]>;
};

type TypedApi<T extends DeepAsyncRecord<T>> = {
  endpoints: TypedApiInner<T>;
  useEndpoint: typeof useEndpoint;
};

type TypedApiInner<T extends DeepAsyncRecord<T>> = {
  [key in keyof T]: T[key] extends AsyncFn
    ? (
        ...args: [...Parameters<T[key]>, { enabled?: boolean } | void]
      ) => ReturnType<T[key]>
    : T[key] extends DeepAsyncRecord<T[key]>
    ? TypedApiInner<T[key]>
    : never;
};

type EndpointRequest = {
  endpointPath: string;
};

function useEndpoint<T extends Promise<any>>(
  prom: T
):
  | {
      data: UnwrapPromise<T>;
      status: "success";
      isError: false;
      isFetching: false;
      isIdle: false;
      isSuccess: true;
    }
  | {
      status: "fetching";
      isError: false;
      isFetching: true;
      isIdle: false;
      isSuccess: false;
      data: null;
    }
  | {
      status: "idle";
      isError: false;
      isFetching: true;
      isIdle: true;
      isSuccess: false;
      data: null;
    }
  | {
      status: "error";
      isError: true;
      isFetching: false;
      isIdle: false;
      isSuccess: false;
      data: null;
      error: unknown;
    } {
  return {
    status: "fetching",
    isError: false,
    isFetching: true,
    isIdle: false,
    isSuccess: false,
    data: null,
  };
}
