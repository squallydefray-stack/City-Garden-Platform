import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Users, Sprout } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function GardenCard({ garden }) {
  return (
    <Link to={createPageUrl(`GardenProfile?id=${garden.id}`)}>
      <Card className="group overflow-hidden border-0 shadow-sm hover:shadow-xl transition-all duration-500 bg-white cursor-pointer">
        <div className="relative h-48 overflow-hidden">
          <img
            src={garden.image_url || `https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&auto=format&fit=crop`}
            alt={garden.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          {garden.is_public && (
            <Badge className="absolute top-4 right-4 bg-emerald-600/90 text-white border-0">
              Open to Public
            </Badge>
          )}
        </div>
        <CardContent className="p-5">
          <h3 className="font-semibold text-lg text-slate-800 mb-2 group-hover:text-emerald-700 transition-colors">
            {garden.name}
          </h3>
          <p className="text-slate-500 text-sm line-clamp-2 mb-4">
            {garden.description || "A beautiful community garden"}
          </p>
          <div className="flex items-center gap-4 text-sm text-slate-500">
            {garden.address && (
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-emerald-600" />
                <span className="truncate max-w-[120px]">{garden.address}</span>
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <Sprout className="w-4 h-4 text-emerald-600" />
              {garden.available_plots || 0} plots available
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}