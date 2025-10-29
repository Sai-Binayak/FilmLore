import { Entry, CreateEntryInput, UpdateEntryInput } from "@/types/entry";

const BASE_URL =
  import.meta.env.VITE_NODE_API_URL;

function getToken() {
  return localStorage.getItem("token");
}

async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const token = getToken();
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const res = await fetch(url, { ...options, headers });

  if (res.status === 401) {
    localStorage.removeItem("token");
    throw new Error("Unauthorized. Please log in again.");
  }

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || "Request failed");
  }

  return res.json();
}

export const api = {
  async signup(name: string, email: string, password: string) {
    const res = await fetch(`${BASE_URL}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.error || "Signup failed");

    // Save token to localStorage
    if (data.token) localStorage.setItem("token", data.token);

    return data;
  },

  async login(email: string, password: string) {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.error || "Login failed");

    if (data.token) localStorage.setItem("token", data.token);

    return data;
  },

  logout() {
    localStorage.removeItem("token");
  },

  getCurrentUser() {
    const token = getToken();
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload;
    } catch {
      return null;
    }
  },

  async getEntries(page = 1, limit = 20) {
    return fetchWithAuth(`${BASE_URL}/films?page=${page}&limit=${limit}`);
  },

  async getEntry(id: string): Promise<Entry> {
    return fetchWithAuth(`${BASE_URL}/films/${id}`);
  },

  async createEntry(input: CreateEntryInput): Promise<Entry> {
    return fetchWithAuth(`${BASE_URL}/films`, {
      method: "POST",
      body: JSON.stringify(input),
    });
  },

  async updateEntry(input: UpdateEntryInput): Promise<Entry> {
    return fetchWithAuth(`${BASE_URL}/films/${input.id}`, {
      method: "PUT",
      body: JSON.stringify(input),
    });
  },

  async deleteEntry(id: string): Promise<void> {
    await fetchWithAuth(`${BASE_URL}/films/${id}`, { method: "DELETE" });
  },
};
