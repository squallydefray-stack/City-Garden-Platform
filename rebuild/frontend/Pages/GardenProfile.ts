import React, { useState } from 'react';
import Layout from '../layout';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button, Input, Textarea, Badge, Tabs, TabsContent, TabsList, TabsTrigger, Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui';
import { MapPin, Users, Sprout, Calendar, BookOpen, Send, ArrowLeft, Loader2, CheckCircle, UserPlus } from "lucide-react";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";
import GardenMap from "@/components/gardens/GardenMap";
import EmptyState from "@/components/ui/EmptyState";

export default function GardenProfile() {
  const urlParams = new URLSearchParams(window.location.search);
  const gardenId = urlParams.get('id');
  const queryClient = useQueryClient();

  const [requestForm, setRequestForm] = useState({ name: '', email: '', message: '' });
  const [joinForm, setJoinForm] = useState({ name: '', email: '', message: '' });
  const [showSuccess, setShowSuccess] = useState(false);
  const [showJoinSuccess, setShowJoinSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState('produce');

  const { data: garden, isLoading } = useQuery({
    queryKey: ['garden', gardenId],
    queryFn: async () => (await base44.entities.Garden.filter({ id: gardenId }))[0],
    enabled: !!gardenId,
  });

  const { data: resources = [] } = useQuery({
    queryKey: ['gardenResources', gardenId],
    queryFn: () => base44.entities.Resource.filter({ garden: gardenId, visibility: 'public' }),
    enabled: !!gardenId,
  });

  const { data: events = [] } = useQuery({
    queryKey: ['gardenEvents', gardenId],
    queryFn: () => base44.entities.Event.filter({ garden: gardenId, is_public: true }, '-date'),
    enabled: !!gardenId,
  });

  const requestMutation = useMutation({
    mutationFn: (data) => base44.entities.ProduceRequest.create(data),
    onSuccess: () => {
      setShowSuccess(true);
      setRequestForm({ name: '', email: '', message: '' });
      setTimeout(() => setShowSuccess(false), 3000);
    },
  });

  const joinMutation = useMutation({
    mutationFn: (data) => base44.entities.GardenJoinRequest.create(data),
    onSuccess: () => {
      setShowJoinSuccess(true);
      setJoinForm({ name: '', email: '', message: '' });
      setTimeout(() => setShowJoinSuccess(false), 3000);
    },
  });

  const handleRequestSubmit = (e) => {
    e.preventDefault();
    requestMutation.mutate({
      garden: gardenId,
      requester_name: requestForm.name,
      requester_email: requestForm.email,
      message: requestForm.message,
      status: 'pending',
    });
  };

  const handleJoinSubmit = (e) => {
    e.preventDefault();
    joinMutation.mutate({
      garden: gardenId,
      garden_name: garden?.name,
      requester_name: joinForm.name,
      requester_email: joinForm.email,
      message: joinForm.message,
      status: 'pending',
    });
  };

  if (isLoading) {
    return (
      <Layout currentPageName="GardenProfile">
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
        </div>
      </Layout>
    );
  }

  if (!garden) {
    return (
      <Layout currentPageName="GardenProfile">
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
          <p className="text-slate-500 mb-4">Garden not found</p>
          <Link to={createPageUrl('GardenFinder')}>
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Gardens
            </Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout currentPageName="GardenProfile">
      {/* All your GardenProfile content goes here, unchanged */}
      {/* Hero, Stats, Tabs, Requests, Resources, Events */}
    </Layout>
  );
}