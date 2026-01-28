// File: rebuild/frontend/entities/Plot.ts
export interface Plot {
  garden: string; // reference to Garden name or ID
  plot_number: string;
  assigned_user?: string;
  assigned_user_name?: string;
  status?: "available" | "assigned" | "reserved";
  size?: string;
  notes?: string;
}