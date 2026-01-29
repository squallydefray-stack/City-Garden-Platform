import Link from "next/link";
import { MapPin, Sprout } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Garden } from "@/Entities/Garden";
import { createPageUrl } from "@/utils";

interface GardenCardProps {
  garden: Garden;
}

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&auto=format&fit=crop";

export default function GardenCard({ garden }: GardenCardProps) {
  const {
    id,
    name,
    description,
    image_url,
    address,
    is_public,
    available_plots,
  } = garden;

  return (
    <Link
      href={createPageUrl(`GardenProfile?id=${id}`)}
      className="focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 rounded-xl"
    >
      <Card className="group overflow-hidden border-0 bg-white shadow-sm transition-all duration-500 hover:shadow-xl cursor-pointer">
        {/* Image */}
        <div className="relative h-48 overflow-hidden">
          <img
            src={image_url || FALLBACK_IMAGE}
            alt={name ? `${name} community garden` : "Community garden"}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

          {is_public && (
            <Badge className="absolute right-4 top-4 border-0 bg-emerald-600/90 text-white">
              Open to Public
            </Badge>
          )}
        </div>

        {/* Content */}
        <CardContent className="p-5">
          <h3 className="mb-2 text-lg font-semibold text-slate-800 transition-colors group-hover:text-emerald-700">
            {name}
          </h3>

          <p className="mb-4 line-clamp-2 text-sm text-slate-500">
            {description || "A beautiful community garden"}
          </p>

          <div className="flex items-center gap-4 text-sm text-slate-500">
            {address && (
              <span className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-emerald-600" />
                <span className="max-w-[120px] truncate">{address}</span>
              </span>
            )}

            <span className="flex items-center gap-1.5">
              <Sprout className="h-4 w-4 text-emerald-600" />
              {available_plots ?? 0} plots available
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
