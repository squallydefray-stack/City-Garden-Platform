import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  Search,
  MapPin,
  Grid3X3,
  Loader2,
  Sprout,
  Filter,
} from "lucide-react";

import Layout from "@/components/layout/Layout";
import GardenCard from "@/components/gardens/GardenCard";
import GardenMap from "@/components/gardens/GardenMap";
import EmptyState from "@/components/ui/EmptyState";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { base44 } from "@/api/base44Client";
import { Garden } from "@/Entities/Garden";
import { City } from "@/Entities/City";

type ViewMode = "grid" | "map";

export default function GardenFinder() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCity, setSelectedCity] = useState<string>("all");
  const [view, setView] = useState<ViewMode>("grid");

  /* --------------------------------------------
   * Queries
   * ------------------------------------------ */
  const gardensQuery = useQuery<Garden[]>({
    queryKey: ["publicGardens"],
    queryFn: () =>
      base44.entities.Garden.filter({
        is_public: true,
        status: "active",
      }),
  });

  const citiesQuery = useQuery<City[]>({
    queryKey: ["cities"],
    queryFn: () => base44.entities.City.filter({ is_active: true }),
  });

  /* --------------------------------------------
   * Derived data (memoized)
   * ------------------------------------------ */
  const filteredGardens = useMemo(() => {
    if (!gardensQuery.data) return [];

    return gardensQuery.data.filter((garden) => {
      const search = searchTerm.toLowerCase();

      const matchesSearch =
        garden.name?.toLowerCase().includes(search) ||
        garden.address?.toLowerCase().includes(search);

      const matchesCity =
        selectedCity === "all" || garden.city === selectedCity;

      return matchesSearch && matchesCity;
    });
  }, [gardensQuery.data, searchTerm, selectedCity]);

  /* --------------------------------------------
   * Loading state
   * ------------------------------------------ */
  if (gardensQuery.isLoading) {
    return (
      <Layout title="Find a Garden">
        <div className="flex min-h-screen items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
        </div>
      </Layout>
    );
  }

  /* --------------------------------------------
   * Render
   * ------------------------------------------ */
  return (
    <Layout title="Find a Garden">
      <div className="min-h-screen bg-gradient-to-b from-emerald-50/50 to-white">
        <div className="mx-auto max-w-7xl px-4 py-10">
          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10 text-center"
          >
            <h1 className="mb-3 text-4xl font-bold text-slate-800">
              Find a Community Garden
            </h1>
            <p className="text-slate-500">
              Discover public gardens near you and start growing together
            </p>
          </motion.div>

          {/* Filters */}
          <div className="mb-8 flex flex-col gap-4 rounded-xl bg-white p-4 shadow-sm md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search by name or address"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>

            <Select value={selectedCity} onValueChange={setSelectedCity}>
              <SelectTrigger className="w-full md:w-64">
                <SelectValue placeholder="Filter by city" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Cities</SelectItem>
                {citiesQuery.data?.map((city) => (
                  <SelectItem key={city.id} value={city.id}>
                    {city.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Tabs
              value={view}
              onValueChange={(v) => setView(v as ViewMode)}
            >
              <TabsList>
                <TabsTrigger value="grid">
                  <Grid3X3 className="mr-2 h-4 w-4" />
                  Grid
                </TabsTrigger>
                <TabsTrigger value="map">
                  <MapPin className="mr-2 h-4 w-4" />
                  Map
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Results */}
          {filteredGardens.length === 0 ? (
            <EmptyState
              icon={Sprout}
              title="No Gardens Found"
              description="Try adjusting your search or filters."
            />
          ) : view === "grid" ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredGardens.map((garden) => (
                <GardenCard key={garden.id} garden={garden} />
              ))}
            </div>
          ) : (
            <GardenMap gardens={filteredGardens} />
          )}
        </div>
      </div>
    </Layout>
  );
}
