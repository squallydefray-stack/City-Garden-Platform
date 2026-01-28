import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { cn } from "@/lib/utils";

export default function QuickActions({ actions }) {
  return (
    <Card className="p-6 border-0 shadow-sm bg-white">
      <h3 className="font-semibold text-slate-800 mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action, idx) => (
          <Link key={idx} to={createPageUrl(action.page)}>
            <Button
              variant="outline"
              className={cn(
                "w-full h-auto py-4 flex flex-col items-center gap-2 border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/50 transition-all",
                action.primary && "bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700 hover:border-emerald-700"
              )}
            >
              <action.icon className="w-5 h-5" />
              <span className="text-sm font-medium">{action.label}</span>
            </Button>
          </Link>
        ))}
      </div>
    </Card>
  );
}