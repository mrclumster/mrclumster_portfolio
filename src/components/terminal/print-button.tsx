"use client";

import { TerminalButton } from "./terminal-button";

export function PrintButton() {
  return <TerminalButton onClick={() => window.print()}>print</TerminalButton>;
}
