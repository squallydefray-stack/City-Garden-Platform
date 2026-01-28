import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Wrench, QrCode, Smartphone, CheckCircle, AlertCircle, Clock } from "lucide-react";

const statusConfig = {
  available: {
    label: 'Available',
    color: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    icon: CheckCircle,
  },
  in_use: {
    label: 'In Use',
    color: 'bg-amber-100 text-amber-700 border-amber-200',
    icon: Clock,
  },
  maintenance: {
    label: 'Maintenance',
    color: 'bg-red-100 text-red-700 border-red-200',
    icon: AlertCircle,
  },
};

const trackingIcons = {
  manual: null,
  qr: QrCode,
  nfc: Smartphone,
};

export default function ToolCard({ tool, onCheckout, onReturn, canManage = false }) {
  const status = statusConfig[tool.status] || statusConfig.available;
  const TrackingIcon = trackingIcons[tool.tracking_type];
  const StatusIcon = status.icon;

  return (
    <Card className="border-0 shadow-sm hover:shadow-md transition-shadow bg-white">
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center">
              <Wrench className="w-6 h-6 text-slate-600" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800">{tool.name}</h3>
              {tool.location && (
                <p className="text-sm text-slate-500">{tool.location}</p>
              )}
            </div>
          </div>
          <Badge className={`${status.color} border`}>
            <StatusIcon className="w-3 h-3 mr-1" />
            {status.label}
          </Badge>
        </div>

        {tool.description && (
          <p className="text-sm text-slate-600 mb-4">{tool.description}</p>
        )}

        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <div className="flex items-center gap-2">
            {TrackingIcon && (
              <div className="flex items-center gap-1 text-xs text-slate-500">
                <TrackingIcon className="w-4 h-4" />
                <span className="capitalize">{tool.tracking_type} tracking</span>
              </div>
            )}
          </div>
          
          {canManage && (
            <div className="flex gap-2">
              {tool.status === 'available' && (
                <Button
                  size="sm"
                  onClick={() => onCheckout?.(tool)}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  Check Out
                </Button>
              )}
              {tool.status === 'in_use' && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onReturn?.(tool)}
                  className="border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                >
                  Return
                </Button>
              )}
            </div>
          )}
        </div>

        {tool.status === 'in_use' && tool.current_user && (
          <p className="text-xs text-slate-500 mt-2">
            Currently with: {tool.current_user}
          </p>
        )}
      </CardContent>
    </Card>
  );
}