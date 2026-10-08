"use client";
import { useSyncExternalStore } from "react";

/**
 * The checklist lives in localStorage so people can come back to it. Exposed as an external store
 * so React can hydrate with an empty list on the server and pick up the saved checks on the client
 * (and in other open tabs) without a flash or a hydration mismatch.
 */
export const STORAGE_KEY = "bhb-vote-checklist-v1";

export type Checked = Record<string, boolean>;

const EMPTY: Checked = {};
const listeners = new Set<() => void>();
let cachedRaw: string | null | undefined;
let cached: Checked = EMPTY;

function read(): Checked {
  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(STORAGE_KEY);
  } catch {
    raw = null;
  }
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    try {
      cached = raw ? (JSON.parse(raw) as Checked) : EMPTY;
    } catch {
      cached = EMPTY;
    }
  }
  return cached;
}

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  window.addEventListener("storage", onChange);
  return () => {
    listeners.delete(onChange);
    window.removeEventListener("storage", onChange);
  };
}

export function writeChecked(next: Checked) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Private mode or storage disabled: keep the in-memory copy so checks still work this visit.
    cachedRaw = JSON.stringify(next);
    cached = next;
  }
  listeners.forEach((l) => l());
}

export function useChecked(): Checked {
  return useSyncExternalStore(subscribe, read, () => EMPTY);
}
