/// <reference types="vite/client" />

interface Window {
  __REACT_DEVTOOLS_GLOBAL_HOOK__?: {
    onCommitFiberRoot?: (id: number, root: unknown) => void;
    onCommitFiberUnmount?: (id: number, fiber: unknown) => void;
  };
}
