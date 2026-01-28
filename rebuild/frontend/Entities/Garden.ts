// File: rebuild/frontend/entities/Garden.ts
export interface Garden {
  name: string;
  description?: string;
  latitude?: number;
  longitude?: number;
  is_public?: boolean;
  city: string;
  address?: string;
  image_url?: string;
  total_plots?: number;
  available_plots?: number;
  status?: "pending" | "approved" | "active" | "inactive";
}