import React, { useState, useEffect } from 'react';
import Layout from '../layout';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle, Button, Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Tabs, TabsContent, TabsList, TabsTrigger, Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, Table, TableBody, TableCell, TableHead, TableHeader, TableRow, Badge, Switch, EmptyState } from '@/components/ui';
import { Building2, Sprout, Users, Plus, Pencil, Trash2, Loader2, Globe, Shield, BarChart3 } from "lucide-react";
import StatsCard from "@/components/dashboard/StatsCard";
import { motion } from "framer-motion";

export default function PlatformAdmin() {
  const queryClient = useQueryClient();
  const [user, setUser] = useState(null);
  const [cityDialog, setCityDialog] = useState({ open: false, data: null });

  useEffect(() => {
    const loadUser = async () => {
      const currentUser = await base44.auth.me();
      setUser(currentUser);
    };
    loadUser();
  }, []);

  const { data: cities = [], isLoading: citiesLoading } = useQuery({
    queryKey: ['allCities'],
    queryFn: () => base44.entities.City.list(),
  });

  const { data: gardens = [] } = useQuery({
    queryKey: ['allGardens'],
    queryFn: () => base44.entities.Garden.list(),
  });

  const { data: users = [] } = useQuery({
    queryKey: ['allUsers'],
    queryFn: () => base44.entities.User.list(),
  });

  const cityAdmins = users.filter(u => u.platform_role === 'city_admin');

  const cityMutation = useMutation({
    mutationFn: async ({ action, data }) => {
      if (action === 'create') return base44.entities.City.create(data);
      if (action === 'update') return base44.entities.City.update(data.id, data);
      if (action === 'delete') return base44.entities.City.delete(data.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['allCities']);
      setCityDialog({ open: false, data: null });
    },
  });

  const totalGardens = gardens.length;
  const activeGardens = gardens.filter(g => g.status === 'active').length;
  const totalMembers = users.filter(u => u.platform_role === 'member').length;

  if (user && user.platform_role !== 'platform_admin') {
    return (
      <Layout currentPageName="PlatformAdmin">
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
          <EmptyState
            icon={Shield}
            title="Access Denied"
            description="You need platform admin privileges to access this dashboard."
          />
        </div>
      </Layout>
    );
  }

  return (
    <Layout currentPageName="PlatformAdmin">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Platform Administration</h1>
          <p className="text-slate-500">Manage cities, admins, and platform-wide metrics</p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatsCard title="Total Cities" value={cities.length} icon={Building2} color="blue" />
          <StatsCard title="Total Gardens" value={totalGardens} icon={Sprout} color="emerald" />
          <StatsCard title="Active Gardens" value={activeGardens} icon={Globe} color="purple" />
          <StatsCard title="Total Members" value={totalMembers} icon={Users} color="amber" />
        </div>

        {/* Tabs */}
        <Tabs defaultValue="cities" className="space-y-6">
          <TabsList className="bg-white shadow-sm border border-slate-200 p-1 rounded-xl">
            <TabsTrigger value="cities" className="rounded-lg data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
              <Building2 className="w-4 h-4 mr-2" /> Cities
            </TabsTrigger>
            <TabsTrigger value="admins" className="rounded-lg data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
              <Shield className="w-4 h-4 mr-2" /> City Admins
            </TabsTrigger>
            <TabsTrigger value="metrics" className="rounded-lg data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
              <BarChart3 className="w-4 h-4 mr-2" /> Metrics
            </TabsTrigger>
          </TabsList>

          {/* Cities Tab */}
          <TabsContent value="cities">
            {/* Cities management content unchanged */}
          </TabsContent>

          {/* Admins Tab */}
          <TabsContent value="admins">
            {/* City Admins table content unchanged */}
          </TabsContent>

          {/* Metrics Tab */}
          <TabsContent value="metrics">
            {/* Metrics cards content unchanged */}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}