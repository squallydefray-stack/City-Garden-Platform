import React, { useEffect, useMemo, useState } from "react";
import Layout from "@/components/layout/Layout";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import {
  Users,
  LayoutGrid,
  Wrench,
  Calendar,
  UserPlus,
  Trash2,
  CheckCircle,
  XCircle,
} from "lucide-react";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/toast";

import StatsCard from "@/components/dashboard/StatsCard";
import EmptyState from "@/components/ui/EmptyState";

/* ================================
   Helpers
================================ */

const StatusBadge = ({ status }: { status: string }) => (
  <Badge
    className={
      status === "pending"
        ? "bg-amber-100 text-amber-700"
        : status === "approved"
        ? "bg-emerald-100 text-emerald-700"
        : "bg-rose-100 text-rose-700"
    }
  >
    {status}
  </Badge>
);

const exportCSV = (rows: any[], filename: string) => {
  if (!rows.length) return toast.error("Nothing to export");

  const headers = Object.keys(rows[0]);
  const csv = [
    headers.join(","),
    ...rows.map(r =>
      headers.map(h => JSON.stringify(r[h] ?? "")).join(",")
    ),
  ].join("\n");

  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
};

/* ================================
   Reusable UI
================================ */

const StatsHeader = ({ members, plots, tools, events, requests }: any) => (
  <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
    <StatsCard title="Members" value={members} icon={Users} />
    <StatsCard title="Plots" value={plots} icon={LayoutGrid} />
    <StatsCard title="Tools" value={tools} icon={Wrench} />
    <StatsCard title="Events" value={events} icon={Calendar} />
    <StatsCard title="Requests" value={requests} icon={UserPlus} />
  </div>
);

const CrudTable = ({
  rows,
  columns,
  actions,
}: {
  rows: any[];
  columns: any[];
  actions?: (row: any) => React.ReactNode;
}) => (
  <Table>
    <TableHeader>
      <TableRow>
        {columns.map((c: any) => (
          <TableHead key={c.key}>{c.label}</TableHead>
        ))}
        {actions && <TableHead />}
      </TableRow>
    </TableHeader>
    <TableBody>
      {rows.map(row => (
        <TableRow key={row.id}>
          {columns.map((c: any) => (
            <TableCell key={c.key}>{c.render(row)}</TableCell>
          ))}
          {actions && <TableCell>{actions(row)}</TableCell>}
        </TableRow>
      ))}
    </TableBody>
  </Table>
);

/* ================================
   Main
================================ */

export default function OrganizerDashboard() {
  const qc = useQueryClient();
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("members");
  const [search, setSearch] = useState("");

  useEffect(() => {
    base44.auth.me().then(setUser);
  }, []);

  const gardenId = user?.garden;

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

  const events = useQuery({
    queryKey: ["events", gardenId],
    queryFn: () => base44.entities.Event.filter({ garden: gardenId }, "-date"),
    enabled: !!gardenId,
  });

  const requests = useQuery({
    queryKey: ["requests", gardenId],
    queryFn: () =>
      base44.entities.GardenJoinRequest.filter({ garden: gardenId }),
    enabled: !!gardenId,
  });

  const deletePlot = useMutation({
    mutationFn: (id: string) => base44.entities.Plot.delete(id),
    onSuccess: () => {
      qc.invalidateQueries(["plots", gardenId]);
      toast.success("Plot deleted");
    },
  });

  const updateRequest = useMutation({
    mutationFn: ({ id, status }: any) =>
      base44.entities.GardenJoinRequest.update(id, { status }),
    onSuccess: () => {
      qc.invalidateQueries(["requests", gardenId]);
      toast.success("Request updated");
    },
  });

  if (!gardenId) {
    return (
      <Layout title="Garden Admin">
        <EmptyState
          icon={LayoutGrid}
          title="No garden assigned"
          description="You must be an organizer to access this dashboard."
        />
      </Layout>
    );
  }

  const filteredMembers =
    members.data?.filter((m: any) =>
      m.full_name.toLowerCase().includes(search.toLowerCase())
    ) || [];

  return (
    <Layout title="Garden Admin">
      <StatsHeader
        members={members.data?.length || 0}
        plots={plots.data?.length || 0}
        tools={0}
        events={events.data?.length || 0}
        requests={
          requests.data?.filter((r: any) => r.status === "pending").length || 0
        }
      />

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="plots">Plots</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="requests">Requests</TabsTrigger>
        </TabsList>

        <TabsContent value="members">
          <Input
            placeholder="Search members…"
            className="mb-4"
            onChange={e => setSearch(e.target.value)}
          />
          <CrudTable
            rows={filteredMembers}
            columns={[
              { key: "name", label: "Name", render: (r: any) => r.full_name },
              { key: "email", label: "Email", render: (r: any) => r.email },
            ]}
          />
        </TabsContent>

        <TabsContent value="plots">
          <CrudTable
            rows={plots.data || []}
            columns={[
              {
                key: "plot",
                label: "Plot #",
                render: (r: any) => r.plot_number,
              },
            ]}
            actions={r => (
              <Button
                size="sm"
                variant="outline"
                onClick={() => deletePlot.mutate(r.id)}
              >
                <Trash2 className="w-4 h-4 text-red-600" />
              </Button>
            )}
          />
        </TabsContent>

        <TabsContent value="events">
          <CrudTable
            rows={events.data || []}
            columns={[
              { key: "title", label: "Title", render: (r: any) => r.title },
              {
                key: "date",
                label: "Date",
                render: (r: any) => format(new Date(r.date), "PPP"),
              },
            ]}
          />
        </TabsContent>

        <TabsContent value="requests">
          <CrudTable
            rows={requests.data || []}
            columns={[
              {
                key: "user",
                label: "User",
                render: (r: any) => r.user.full_name,
              },
              {
                key: "status",
                label: "Status",
                render: (r: any) => <StatusBadge status={r.status} />,
              },
            ]}
            actions={r => (
              <div className="flex gap-2">
                <Button
                  onClick={() =>
                    updateRequest.mutate({ id: r.id, status: "approved" })
                  }
                >
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                </Button>
                <Button
                  onClick={() =>
                    updateRequest.mutate({ id: r.id, status: "rejected" })
                  }
                >
                  <XCircle className="w-4 h-4 text-rose-600" />
                </Button>
              </div>
            )}
          />
        </TabsContent>
      </Tabs>

      <div className="mt-8">
        <Button
          variant="outline"
          onClick={() => exportCSV(plots.data || [], "plots.csv")}
        >
          Export Plots CSV
        </Button>
      </div>
    </Layout>
  );
}