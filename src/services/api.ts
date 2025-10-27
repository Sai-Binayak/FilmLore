import { Entry, CreateEntryInput, UpdateEntryInput } from "@/types/entry";

const BASE_URL = "http://localhost:5000"; // backend URL

export const api = {
  // GET /films
   async getEntries(page = 1, limit = 20) {
    const res = await fetch(`${BASE_URL}/films?page=${page}&limit=${limit}`);
    if (!res.ok) throw new Error("Failed to fetch entries");
    return await res.json(); // { data, hasMore }
  },


  // GET /films/:id
  async getEntry(id: string): Promise<Entry> {
    const res = await fetch(`${BASE_URL}/films/${id}`);
    if (!res.ok) throw new Error("Entry not found");
    return await res.json();
  },

  // POST /films
  async createEntry(input: CreateEntryInput): Promise<Entry> {
    const res = await fetch(`${BASE_URL}/films`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    if (!res.ok) throw new Error("Failed to create entry");
    return await res.json();
  },

  // PUT /films/:id
  async updateEntry(input: UpdateEntryInput): Promise<Entry> {
    const res = await fetch(`${BASE_URL}/films/${input.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    if (!res.ok) throw new Error("Failed to update entry");
    return await res.json();
  },

  // DELETE /films/:id
  async deleteEntry(id: string): Promise<void> {
    const res = await fetch(`${BASE_URL}/films/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Failed to delete entry");
  },
};
