"use client";

import { create } from "zustand";
import type { Page } from "@/types";

type NavState = {
  page: Page;
  params: Record<string, string>;
  // history for back/forward
  history: { page: Page; params: Record<string, string> }[];
  historyIndex: number;
  navigate: (page: Page, params?: Record<string, string>) => void;
  back: () => void;
  canGoBack: () => boolean;
  // search query (shop page)
  searchQuery: string;
  setSearchQuery: (q: string) => void;
};

function syncHash(page: Page, params: Record<string, string>) {
  const url = new URL(window.location.href);
  url.searchParams.set("page", page);
  for (const [k, v] of Object.entries(params)) {
    if (v) url.searchParams.set(k, v);
    else url.searchParams.delete(k);
  }
  window.history.pushState({}, "", url.toString());
}

export const useNavStore = create<NavState>((set, get) => ({
  page: "home",
  params: {},
  history: [{ page: "home", params: {} }],
  historyIndex: 0,
  navigate: (page, params = {}) => {
    const state = get();
    // truncate forward history
    const newHistory = state.history.slice(0, state.historyIndex + 1);
    newHistory.push({ page, params });
    set({
      page,
      params,
      history: newHistory,
      historyIndex: newHistory.length - 1,
    });
    if (typeof window !== "undefined") {
      syncHash(page, params);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  },
  back: () => {
    const state = get();
    if (state.historyIndex > 0) {
      const newIndex = state.historyIndex - 1;
      const prev = state.history[newIndex];
      set({ page: prev.page, params: prev.params, historyIndex: newIndex });
      if (typeof window !== "undefined") {
        syncHash(prev.page, prev.params);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  },
  canGoBack: () => get().historyIndex > 0,
  searchQuery: "",
  setSearchQuery: (q) => set({ searchQuery: q }),
}));

// Parse initial hash on load (client only)
export function initFromHash() {
  if (typeof window === "undefined") return;
  const params = new URLSearchParams(window.location.search);
  const page = (params.get("page") as Page) || "home";
  const pageParams: Record<string, string> = {};
  for (const [k, v] of params.entries()) {
    if (k !== "page") pageParams[k] = v;
  }
  useNavStore.setState({
    page,
    params: pageParams,
    history: [{ page, params: pageParams }],
    historyIndex: 0,
  });

  window.addEventListener("popstate", () => {
    const p = new URLSearchParams(window.location.search);
    const pg = (p.get("page") as Page) || "home";
    const pp: Record<string, string> = {};
    for (const [k, v] of p.entries()) {
      if (k !== "page") pp[k] = v;
    }
    useNavStore.setState({ page: pg, params: pp });
  });
}
