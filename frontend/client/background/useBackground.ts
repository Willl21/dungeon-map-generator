import { useContext } from "react";
import { BackgroundContext } from "./BackgroundContext";

export function useBackground() {
  const ctx = useContext(BackgroundContext);
  if (!ctx) {
    throw new Error("useBackground must be used within a <BackgroundProvider>");
  }
  return ctx;
}
