import React from 'react';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Megaphone } from "lucide-react";

export default function MessageItem({ message, isOwn }) {
  const initials = message.sender_name
    ?.split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase() || '?';

  return (
    <div className={`flex gap-3 ${isOwn ? 'flex-row-reverse' : ''}`}>
      <Avatar className="w-10 h-10 shrink-0">
        <AvatarFallback className={isOwn ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-700"}>
          {initials}
        </AvatarFallback>
      </Avatar>
      <div className={`flex-1 max-w-[80%] ${isOwn ? 'text-right' : ''}`}>
        <div className="flex items-center gap-2 mb-1">
          {!isOwn && (
            <span className="font-medium text-sm text-slate-800">
              {message.sender_name || 'Anonymous'}
            </span>
          )}
          {message.is_announcement && (
            <Badge variant="outline" className="text-xs border-amber-300 text-amber-700 bg-amber-50">
              <Megaphone className="w-3 h-3 mr-1" />
              Announcement
            </Badge>
          )}
          <span className="text-xs text-slate-400">
            {format(new Date(message.created_date), 'MMM d, h:mm a')}
          </span>
        </div>
        <div className={`inline-block rounded-2xl px-4 py-3 ${
          isOwn 
            ? 'bg-emerald-600 text-white rounded-tr-md' 
            : message.is_announcement 
              ? 'bg-amber-50 text-slate-800 border border-amber-200 rounded-tl-md'
              : 'bg-slate-100 text-slate-800 rounded-tl-md'
        }`}>
          <p className="text-sm whitespace-pre-wrap">{message.message_text}</p>
        </div>
      </div>
    </div>
  );
}