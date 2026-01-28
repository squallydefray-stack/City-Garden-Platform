import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Layout from "@/components/layout/Layout";
import { base44 } from "@/api/base44Client";
import StatsCard from "@/components/dashboard/StatsCard";
import EmptyState from "@/components/ui/EmptyState";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Input,
  Textarea,
} from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Sprout,
  Wrench,
  BookOpen,
  Plus,
  Pencil,
  Trash2,
  Loader2,
  LayoutGrid,
  UserPlus,
  CheckCircle,
  XCircle,
  Calendar,
} from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";

export default function CityDashboard() {
  const queryClient = useQueryClient();
  const [user, setUser] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState({ type: null, data: null });

  // Load current user
  useEffect(() => {
    const loadUser = async () => {
      const currentUser = await base44.auth.me();
      setUser(currentUser);
    };
    loadUser();
  }, []);

  const cityId = user?.city;

  // Queries
  const { data: gardens = [], isLoading: gardensLoading } = useQuery({
    queryKey: ["cityGardens", cityId],
    queryFn: () =>
      base44.entities.Garden.filter({ city: cityId }),
    enabled: !!cityId,
  });

  const { data: plots = [], isLoading: plotsLoading } = useQuery({
    queryKey: ["cityPlots", cityId],
    queryFn: () =>
      base44.entities.Plot.filter({ city: cityId }),
    enabled: !!cityId,
  });

  const { data: resources = [], isLoading: resourcesLoading } = useQuery({
    queryKey: ["cityResources", cityId],
    queryFn: () =>
      base44.entities.Resource.filter({ city: cityId }),
    enabled: !!cityId,
  });

  const { data: events = [], isLoading: eventsLoading } = useQuery({
    queryKey: ["cityEvents", cityId],
    queryFn: () =>
      base44.entities.Event.filter({ city: cityId }, "-date"),
    enabled: !!cityId,
  });

  // Mutations
  const gardenMutation = useMutation({
    mutationFn: async ({ action, data }: any) => {
      if (action === "create") return base44.entities.Garden.create(data);
      if (action === "update") return base44.entities.Garden.update(data.id, data);
      if (action === "delete") return base44.entities.Garden.delete(data.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["cityGardens"]);
      setDialogOpen({ type: null, data: null });
    },
  });

  const resourceMutation = useMutation({
    mutationFn: async ({ action, data }: any) => {
      if (action === "create") return base44.entities.Resource.create(data);
      if (action === "update") return base44.entities.Resource.update(data.id, data);
      if (action === "delete") return base44.entities.Resource.delete(data.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["cityResources"]);
      setDialogOpen({ type: null, data: null });
    },
  });

  const eventMutation = useMutation({
    mutationFn: async ({ action, data }: any) => {
      if (action === "create") return base44.entities.Event.create(data);
      if (action === "update") return base44.entities.Event.update(data.id, data);
      if (action === "delete") return base44.entities.Event.delete(data.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["cityEvents"]);
      setDialogOpen({ type: null, data: null });
    },
  });

  if (!cityId) {
    return (
      <Layout title="City Dashboard">
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
          <EmptyState
            icon={Sprout}
            title="No City Assigned"
            description="You need to be assigned as a city organizer to access this dashboard."
          />
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="City Dashboard">
      <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-slate-800 mb-2">
              City Admin
            </h1>
            <p className="text-slate-500">{user?.city_name || "Your City"}</p>
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            <StatsCard title="Gardens" value={gardens.length} icon={Sprout} color="emerald" />
            <StatsCard title="Plots" value={plots.length} icon={LayoutGrid} color="blue" />
            <StatsCard title="Resources" value={resources.length} icon={BookOpen} color="amber" />
            <StatsCard title="Events" value={events.length} icon={Calendar} color="purple" />
          </div>

          {/* Tabs */}
          <Tabs defaultValue="gardens" className="space-y-6">
            <TabsList className="bg-white shadow-sm border border-slate-200 p-1 rounded-xl">
              <TabsTrigger value="gardens" className="rounded-lg data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
                <Sprout className="w-4 h-4 mr-2" /> Gardens
              </TabsTrigger>
              <TabsTrigger value="resources" className="rounded-lg data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
                <BookOpen className="w-4 h-4 mr-2" /> Resources
              </TabsTrigger>
              <TabsTrigger value="events" className="rounded-lg data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
                <Calendar className="w-4 h-4 mr-2" /> Events
              </TabsTrigger>
            </TabsList>

            {/* Gardens Tab */}
            <TabsContent value="gardens">
              <Card className="border-0 shadow-sm">
                <CardHeader className="flex justify-between items-center">
                  <CardTitle>City Gardens</CardTitle>
                  <Button
                    onClick={() => setDialogOpen({ type: "garden", data: { city: cityId, name: "" } })}
                    className="bg-emerald-600 hover:bg-emerald-700"
                  >
                    <Plus className="w-4 h-4 mr-2" /> Add Garden
                  </Button>
                </CardHeader>
                <CardContent>
                  {gardensLoading ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
                    </div>
                  ) : gardens.length === 0 ? (
                    <EmptyState
                      icon={Sprout}
                      title="No Gardens Yet"
                      description="Add gardens for your city."
                      onAction={() => setDialogOpen({ type: "garden", data: { city: cityId, name: "" } })}
                      actionLabel="Add First Garden"
                    />
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Total Plots</TableHead>
                          <TableHead>Total Members</TableHead>
                          <TableHead className="w-20">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {gardens.map(g => (
                          <TableRow key={g.id}>
                            <TableCell>{g.name}</TableCell>
                            <TableCell>{g.total_plots || "-"}</TableCell>
                            <TableCell>{g.total_members || "-"}</TableCell>
                            <TableCell>
                              <div className="flex gap-1">
                                <Button size="icon" variant="ghost" onClick={() => setDialogOpen({ type: "garden", data: g })}>
                                  <Pencil className="w-4 h-4" />
                                </Button>
                                <Button size="icon" variant="ghost" onClick={() => gardenMutation.mutate({ action: "delete", data: g })}>
                                  <Trash2 className="w-4 h-4 text-red-500" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>

              {/* Garden Dialog */}
              <Dialog open={dialogOpen.type === "garden"} onOpenChange={(open) => !open && setDialogOpen({ type: null, data: null })}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{dialogOpen.data?.id ? "Edit Garden" : "Add New Garden"}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <Input
                      placeholder="Garden Name"
                      value={dialogOpen.data?.name || ""}
                      onChange={(e) => setDialogOpen({ ...dialogOpen, data: { ...dialogOpen.data, name: e.target.value } })}
                    />
                  </div>
                  <DialogFooter>
                    <Button
                      onClick={() => gardenMutation.mutate({ action: dialogOpen.data?.id ? "update" : "create", data: dialogOpen.data })}
                      disabled={gardenMutation.isPending}
                      className="bg-emerald-600 hover:bg-emerald-700"
                    >
                      {gardenMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </TabsContent>

            {/* Resources Tab */}
            <TabsContent value="resources">
              <Card className="border-0 shadow-sm">
                <CardHeader className="flex justify-between items-center">
                  <CardTitle>City Resources</CardTitle>
                  <Button onClick={() => setDialogOpen({ type: "resource", data: { city: cityId, title: "", content: "" } })} className="bg-emerald-600 hover:bg-emerald-700">
                    <Plus className="w-4 h-4 mr-2" /> Add Resource
                  </Button>
                </CardHeader>
                <CardContent>
                  {resourcesLoading ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
                    </div>
                  ) : resources.length === 0 ? (
                    <EmptyState
                      icon={BookOpen}
                      title="No Resources Yet"
                      description="Add resources for city gardens."
                      onAction={() => setDialogOpen({ type: "resource", data: { city: cityId, title: "", content: "" } })}
                      actionLabel="Add First Resource"
                    />
                  ) : (
                    <div className="space-y-4">
                      {resources.map(r => (
                        <Card key={r.id} className="border border-slate-200">
                          <CardContent className="flex justify-between items-start">
                            <div>
                              <h4 className="font-semibold text-slate-800">{r.title}</h4>
                              <p className="text-sm text-slate-600 line-clamp-2">{r.content}</p>
                            </div>
                            <div className="flex gap-1">
                              <Button size="icon" variant="ghost" onClick={() => setDialogOpen({ type: "resource", data: r })}>
                                <Pencil className="w-4 h-4" />
                              </Button>
                              <Button size="icon" variant="ghost" onClick={() => resourceMutation.mutate({ action: "delete", data: r })}>
                                <Trash2 className="w-4 h-4 text-red-500" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Resource Dialog */}
              <Dialog open={dialogOpen.type === "resource"} onOpenChange={(open) => !open && setDialogOpen({ type: null, data: null })}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{dialogOpen.data?.id ? "Edit Resource" : "Add New Resource"}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <Input placeholder="Title" value={dialogOpen.data?.title || ""} onChange={(e) => setDialogOpen({ ...dialogOpen, data: { ...dialogOpen.data, title: e.target.value } })} />
                    <Textarea placeholder="Content" value={dialogOpen.data?.content || ""} onChange={(e) => setDialogOpen({ ...dialogOpen, data: { ...dialogOpen.data, content: e.target.value } })} className="min-h-[200px]" />
                  </div>
                  <DialogFooter>
                    <Button
                      onClick={() => resourceMutation.mutate({ action: dialogOpen.data?.id ? "update" : "create", data: dialogOpen.data })}
                      disabled={resourceMutation.isPending}
                      className="bg-emerald-600 hover:bg-emerald-700"
                    >
                      {resourceMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </TabsContent>

            {/* Events Tab */}
            <TabsContent value="events">
              <Card className="border-0 shadow-sm">
                <CardHeader className="flex justify-between items-center">
                  <CardTitle>City Events</CardTitle>
                  <Button onClick={() => setDialogOpen({ type: "event", data: { city: cityId, title: "", description: "", date: "", time: "", is_public: true } })} className="bg-emerald-600 hover:bg-emerald-700">
                    <Plus className="w-4 h-4 mr-2" /> Add Event
                  </Button>
                </CardHeader>
                <CardContent>
                  {eventsLoading ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
                    </div>
                  ) : events.length === 0 ? (
                    <EmptyState
                      icon={Calendar}
                      title="No Events Yet"
                      description="Create events for city gardens."
                      onAction={() => setDialogOpen({ type: "event", data: { city: cityId, title: "", description: "", date: "", time: "", is_public: true } })}
                      actionLabel="Create First Event"
                    />
                  ) : (
                    <div className="space-y-4">
                      {events.map(ev => (
                        <Card key={ev.id} className="border border-slate-200">
                          <CardContent className="flex justify-between items-start">
                            <div>
                              <h4 className="font-semibold text-slate-800">{ev.title}</h4>
                              <p className="text-sm text-slate-600 line-clamp-2">{ev.description}</p>
                              {ev.date && <p className="text-xs text-purple-600 mt-1">{format(new Date(ev.date), "MMM d")}</p>}
                            </div>
                            <div className="flex gap-1">
                              <Button size="icon" variant="ghost" onClick={() => setDialogOpen({ type: "event", data: ev })}>
                                <Pencil className="w-4 h-4" />
                              </Button>
                              <Button size="icon" variant="ghost" onClick={() => eventMutation.mutate({ action: "delete", data: ev })}>
                                <Trash2 className="w-4 h-4 text-red-500" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Event Dialog */}
              <Dialog open={dialogOpen.type === "event"} onOpenChange={(open) => !open && setDialogOpen({ type: null, data: null })}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{dialogOpen.data?.id ? "Edit Event" : "Add New Event"}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <Input placeholder="Event Title" value={dialogOpen.data?.title || ""} onChange={(e) => setDialogOpen({ ...dialogOpen, data: { ...dialogOpen.data, title: e.target.value } })} />
                    <div className="flex gap-4">
                      <Input type="date" value={dialogOpen.data?.date || ""} onChange={(e) => setDialogOpen({ ...dialogOpen, data: { ...dialogOpen.data, date: e.target.value } })} />
                      <Input placeholder="Time (e.g., 10:00 AM)" value={dialogOpen.data?.time || ""} onChange={(e) => setDialogOpenYes — what you shared is essentially a **full `CityDashboard`** scaffolded within your `Layout`. It wraps all dashboard content in your layout, includes stats cards, tabs for gardens, resources, and events, and supports dialogs for create/edit actions.  
