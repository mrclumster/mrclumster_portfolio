import type { ReactNode } from "react";

export function KeyValueList({ children }: { children: ReactNode }) {
  return <dl className="grid grid-cols-[max-content_1fr] gap-x-3 gap-y-1 text-[14px]">{children}</dl>;
}

export function KeyValue({ k, children }: { k: string; children: ReactNode }) {
  return (
    <>
      <dt className="opacity-60">{k}:</dt>
      <dd>{children}</dd>
    </>
  );
}
