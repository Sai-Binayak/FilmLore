export type EntryType = "Movie" | "TV Show" | "TV_Show"; // Accept both

export interface Entry {
  id: string;
  title: string;
  type: EntryType;
  director: string;
  budget: number; // make this number
  location: string;
  duration: string;
  year_or_time: number; // proper numeric year
  genre?: string;
  rating?: number;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEntryInput {
  title: string;
  type: EntryType;
  director: string;
  budget: number;
  location: string;
  duration: string;
  year_or_time: number;
  genre?: string;
  rating?: number;
  description?: string;
}

export interface UpdateEntryInput extends CreateEntryInput {
  id: string;
}
