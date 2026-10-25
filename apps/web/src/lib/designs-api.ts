import type { DesignOverview, SavedDesign } from "./types";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}/api/designs${path}`, {
    ...init,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });
  const body: unknown = await response.json();

  if (!response.ok) {
    const message =
      typeof body === "object" &&
      body !== null &&
      "error" in body &&
      typeof body.error === "string"
        ? body.error
        : "The design service request failed.";
    throw new Error(message);
  }

  return body as T;
}

export function fetchDesigns(): Promise<SavedDesign[]> {
  return request<SavedDesign[]>("");
}

export function fetchDesignOverview(): Promise<DesignOverview> {
  return request<DesignOverview>("/overview");
}

export function createDesign(
  prompt: string,
  scale: string,
): Promise<SavedDesign> {
  return request<SavedDesign>("", {
    method: "POST",
    body: JSON.stringify({ prompt, scale }),
  });
}

export function createBlankDesign(): Promise<SavedDesign> {
  return request<SavedDesign>("/blank", { method: "POST" });
}

export function saveDesign(
  id: string,
  nodes: SavedDesign["nodes"],
  edges: SavedDesign["edges"],
): Promise<SavedDesign> {
  return request<SavedDesign>(`/${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: JSON.stringify({ nodes, edges }),
  });
}
