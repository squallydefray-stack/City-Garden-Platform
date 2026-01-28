import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import Layout from "@/components/layout/Layout";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { LayoutGrid, Calendar, Wrench, Users } from "lucide-react";
import { format } from "date-fns";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";

import StatsCard from "@/components/dashboard/StatsCard";
import EmptyState from "@/components/ui/EmptyState";

/* =========================================================
   Member Dashboard — Production Ready
   Guards • Permissions • Empty States • Skeletons
========================================================= */

const ALLOWED_ROLES = ["member", "organizer", "admin"];

export default function MemberDashboard() {
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [activeTab, setActiveTab] = useState("plots");
  const [search, setSearch] = useState("");

  /* ---------------- AUTH + ROLE GUARD ---------------- */

  useEffect(() => {
    base44.auth
      .me()
      .then((u: any) => {
        if (!u) {
          router.replace("/login");
          return;
        }

        if (!ALLOWED_ROLES.includes(u.role)) {
          router.replace("/unauthorized");
          return;
        }

        setUser(u);
      })
      .finally(() => setCheckingAuth(false));
  }, [router]);

  if (checkingAuth) {
    return (
      <Layout title="Loading…">
        <div className="py-24 text-center text-muted-foreground">
          Checking access…
        </div>
      </Layout>
    );
  }

  const gardenId = user?.garden;

  /* ---------------- DATA ---------------- */

  const members = useQuery({
    queryKey: ["members", gardenId],
    queryFn: () => base44.entities.User.filter({ garden: gardenId }),
    enabled: !!gardenId,
  });

  const plots = useQuery({
    queryKey: ["plots", gardenId],
    queryFn: () => base44.entities.Plot.filter({ garden: gardenId }),
    enabled: !!gardenId,
  });

  const tools = useQuery({
    queryKey: ["tools", gardenId],
    queryFn: () => base44.entities.Tool.filter({ garden: gardenId }),
    enabled: !!gardenId,
  });

  const events = useQuery({
    queryKey: ["events", gardenId],
    queryFn: () => base44.entities.Event.filter({ garden: gardenId }, "-date"),
    enabled: !!gardenId,
  });

  /* ---------------- NO GARDEN ---------------- */

  if (!gardenId) {
    return (
      <Layout title="Garden">
        <EmptyState
          icon={LayoutGrid}
          title="No garden yet"
          description="Join a garden to see plots, tools, and events."
        />
      </Layout>
    );
  }

  /* ---------------- DERIVED ---------------- */

  const filteredPlots = useMemo(
    () =>
      plots.data?.filter((p: any) =>
        String(p.plot_number).includes(search)
      ) || [],
    [plots.data, search]
  );

  const isLoadingAny =
    members.isLoading || plots.isLoading || tools.isLoading || events.isLoading;

  /* ---------------- UI ---------------- */

  return (
    <Layout
      title={`Welcome back, ${
        user?.full_name?.split(" ")[0] || "Gardener"
      }`}
    >
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard title="Members" value={members.data?.length || 0} icon={Users} />
        <StatsCard title="Plots" value={plots.data?.length || 0} icon={LayoutGrid} />
        <StatsCard title="Tools" value={tools.data?.length || 0} icon={Wrench} />
        <StatsCard title="Events" value={events.data?.length || 0} icon={Calendar} />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="plots">Plots</TabsTrigger>
          <TabsTrigger value="tools">Tools</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="members">Members</TabsTrigger>
        </TabsList>

        {/* ---------------- PLOTS ---------------- */}
        <TabsContent value="plots">
          <Input
            placeholder="Search plot number…"
            className="mb-4"
            onChange={(e) => setSearch(e.target.value)}
          />

          {isLoadingAny ? (
            <div className="py-12 text-center text-muted-foreground">Loading plots…</div>
          ) : filteredPlots.length ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Plot #</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPlots.map((p: any) => (
                  <TableRow key={p.id}>
                    <TableCell>{p.plot_number}</TableCell>
                    <TableCell>{p.status || "Available"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <EmptyState
              icon={LayoutGrid}
              title="No plots"
              description="Plots will appear here once created."
            />
          )}
        </TabsContent>

        {/* ---------------- TOOLS ---------------- */}
        <TabsContent value="tools">
          {isLoadingAny ? (
            <div className="py-12 text-center text-muted-foreground">Loading tools…</div>
          ) : tools.data?.length ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Condition</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tools.data.map((t: any) => (
                  <TableRow key={t.id}>
                    <TableCell>{t.name}</TableCell>
                    <TableCell>{t.condition || "Good"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <EmptyState
              icon={Wrench}
              title="No tools"
              description="Tools will appear here once added."
            />
          )}
        </TabsContent>

        {/* ---------------- EVENTS ---------------- */}
        <TabsContent value="events">
          {isLoadingAny ? (
            <div className="py-12 text-center text-muted-foreground">Loading events…</div>
          ) : events.data?.length ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Event</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {events.data.map((e: any) => (
                  <TableRow key={e.id}>
                    <TableCell>{e.title}</TableCell>
                    <TableCell>{format(new Date(e.date), "PPP")}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <EmptyState
              icon={Calendar}
              title="No events"
              description="Upcoming events will show here."
            />
          )}
        </TabsContent>

        {/* ---------------- MEMBERS ---------------- */}
        <TabsContent value="members">
          {isLoadingAny ? (
            <div className="py-12 text-center text-muted-foreground">Loading members…</div>
          ) : members.data?.length ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {members.data.map((m: any) => (
                  <TableRow key={m.id}>
                    <TableCell>{m.full_name}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <EmptyState
              icon={Users}
              title="No members"
              description="Members will appear once they join."
            />
          )}
        </TabsContent>
      </Tabs>
    </Layout>
  );
}
