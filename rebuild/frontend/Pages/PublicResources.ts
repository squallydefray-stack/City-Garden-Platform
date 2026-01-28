import React, { useState } from 'react';
import Layout from '../layout';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, Input, Badge, Tabs, TabsContent, TabsList, TabsTrigger, EmptyState } from "@/components/ui";
import { BookOpen, Calendar, Megaphone, Lightbulb, Search, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";

const categoryConfig = {
  guide: { icon: BookOpen, color: 'bg-blue-100 text-blue-700' },
  event: { icon: Calendar, color: 'bg-purple-100 text-purple-700' },
  announcement: { icon: Megaphone, color: 'bg-amber-100 text-amber-700' },
  tip: { icon: Lightbulb, color: 'bg-emerald-100 text-emerald-700' },
};

export default function PublicResources() {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('all');

  const { data: resources = [], isLoading } = useQuery({
    queryKey: ['publicResources'],
    queryFn: () => base44.entities.Resource.filter({ visibility: 'public' }, '-created_date'),
  });

  const filteredResources = resources.filter(r => {
    const matchesSearch = r.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          r.content?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = category === 'all' || r.category === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <Layout currentPageName="PublicResources">
      <div className="bg-gradient-to-b from-emerald-50/50 to-white min-h-screen">
        {/* Header */}
        <div className="bg-white border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-4 py-12">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <h1 className="text-4xl font-bold text-slate-800 mb-4">Resources & Guides</h1>
              <p className="text-slate-500 text-lg max-w-2xl">
                Explore gardening tips, event announcements, and helpful guides from community gardens across all cities.
              </p>
            </motion.div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <Input
                placeholder="Search resources..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 h-12 border-slate-200 focus:border-emerald-300 rounded-xl"
              />
            </div>
            <Tabs value={category} onValueChange={setCategory}>
              <TabsList className="bg-white shadow-sm border border-slate-200 p-1 rounded-xl h-12">
                <TabsTrigger value="all" className="rounded-lg data-[state=active]:bg-emerald-600 data-[state=active]:text-white">All</TabsTrigger>
                <TabsTrigger value="guide" className="rounded-lg data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
                  <BookOpen className="w-4 h-4 mr-1.5" /> Guides
                </TabsTrigger>
                <TabsTrigger value="event" className="rounded-lg data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
                  <Calendar className="w-4 h-4 mr-1.5" /> Events
                </TabsTrigger>
                <TabsTrigger value="announcement" className="rounded-lg data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
                  <Megaphone className="w-4 h-4 mr-1.5" /> News
                </TabsTrigger>
                <TabsTrigger value="tip" className="rounded-lg data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
                  <Lightbulb className="w-4 h-4 mr-1.5" /> Tips
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Results */}
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
            </div>
          ) : filteredResources.length === 0 ? (
            <EmptyState
              icon={BookOpen}
              title="No resources found"
              description="Try adjusting your search or check back later for new content."
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResources.map((resource, idx) => {
                const config = categoryConfig[resource.category] || categoryConfig.guide;
                const Icon = config.icon;
                return (
                  <motion.div
                    key={resource.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <Card className="border-0 shadow-sm hover:shadow-lg transition-all duration-300 bg-white h-full">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className={`w-12 h-12 rounded-xl ${config.color} flex items-center justify-center shrink-0`}>
                            <Icon className="w-6 h-6" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <Badge className={`${config.color} border-0 mb-2 text-xs capitalize`}>
                              {resource.category}
                            </Badge>
                            <h3 className="font-semibold text-slate-800 mb-2 line-clamp-2">{resource.title}</h3>
                            <p className="text-sm text-slate-600 line-clamp-3 mb-3">{resource.content}</p>
                            <p className="text-xs text-slate-400">{format(new Date(resource.created_date), 'MMM d, yyyy')}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}