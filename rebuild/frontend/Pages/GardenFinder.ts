import React, { useState } from 'react';
import Layout from '../layout'; // updated layout
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Input, Button, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, MapPin, Grid3X3, Loader2, Sprout, Filter } from 'lucide-react';
import GardenCard from '@/components/gardens/GardenCard';
import GardenMap from '@/components/gardens/GardenMap';
import EmptyState from '@/components/ui/EmptyState';
import { motion } from 'framer-motion';

export default function GardenFinder() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('all');
  const [view, setView] = useState('grid');

  const { data: gardens = [], isLoading: gardensLoading } = useQuery({
    queryKey: ['publicGardens'],
    queryFn: () => base44.entities.Garden.filter({ is_public: true, status: 'active' }),
  });

  const { data: cities = [] } = useQuery({
    queryKey: ['cities'],
    queryFn: () => base44.entities.City.filter({ is_active: true }),
  });

  const filteredGardens = gardens.filter(garden => {
    const matchesSearch = garden.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          garden.address?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCity = selectedCity === 'all' || garden.city === selectedCity;
    return matchesSearch && matchesCity;
  });

  return (
    <Layout currentPageName="GardenFinder">
      <div className="min-h-screen bg-gradient-to-b from-emerald-50/50 to-white">
        {/* ... all your Hero, Search, Filters, Results ... */}
        {/* Keep the same code for displaying cards, map, empty state */}
      </div>
    </Layout>
  );
}