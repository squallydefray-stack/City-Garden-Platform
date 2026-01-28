import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MessageCircle, CheckCircle, ChevronDown, ChevronUp, Send } from "lucide-react";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";

const categoryColors = {
  general: "bg-slate-100 text-slate-700",
  plants: "bg-emerald-100 text-emerald-700",
  pests: "bg-red-100 text-red-700",
  tools: "bg-blue-100 text-blue-700",
  events: "bg-purple-100 text-purple-700",
};

export default function QuestionCard({ question, answers = [], onAnswer, canAnswer = true }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [newAnswer, setNewAnswer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitAnswer = async () => {
    if (!newAnswer.trim()) return;
    setIsSubmitting(true);
    await onAnswer(question.id, newAnswer);
    setNewAnswer('');
    setIsSubmitting(false);
  };

  return (
    <Card className="border-0 shadow-sm hover:shadow-md transition-shadow bg-white overflow-hidden">
      <CardContent className="p-5">
        <div className="flex items-start gap-4">
          <Avatar className="w-10 h-10 shrink-0">
            <AvatarFallback className="bg-emerald-100 text-emerald-700">
              {question.author_name?.[0]?.toUpperCase() || '?'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <span className="font-medium text-slate-800">
                {question.author_name || 'Anonymous'}
              </span>
              <span className="text-xs text-slate-400">
                {format(new Date(question.created_date), 'MMM d, yyyy')}
              </span>
              <Badge className={categoryColors[question.category] || categoryColors.general}>
                {question.category}
              </Badge>
              {question.is_resolved && (
                <Badge className="bg-emerald-100 text-emerald-700 border-0">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Resolved
                </Badge>
              )}
            </div>
            <p className="text-slate-800 mb-3">{question.question}</p>
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-slate-500 hover:text-slate-700 -ml-2"
              >
                <MessageCircle className="w-4 h-4 mr-1.5" />
                {answers.length} {answers.length === 1 ? 'answer' : 'answers'}
                {isExpanded ? (
                  <ChevronUp className="w-4 h-4 ml-1" />
                ) : (
                  <ChevronDown className="w-4 h-4 ml-1" />
                )}
              </Button>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-4 pt-4 border-t border-slate-100 space-y-4">
                {answers.map((answer) => (
                  <div key={answer.id} className="flex gap-3 pl-4 border-l-2 border-emerald-200">
                    <Avatar className="w-8 h-8 shrink-0">
                      <AvatarFallback className="bg-slate-100 text-slate-600 text-xs">
                        {answer.author_name?.[0]?.toUpperCase() || '?'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm text-slate-700">
                          {answer.author_name || 'Anonymous'}
                        </span>
                        <span className="text-xs text-slate-400">
                          {format(new Date(answer.created_date), 'MMM d')}
                        </span>
                        {answer.is_accepted && (
                          <Badge className="bg-emerald-100 text-emerald-700 text-xs">
                            ✓ Accepted
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-slate-600">{answer.answer}</p>
                    </div>
                  </div>
                ))}

                {canAnswer && (
                  <div className="flex gap-2 pt-2">
                    <Textarea
                      placeholder="Write your answer..."
                      value={newAnswer}
                      onChange={(e) => setNewAnswer(e.target.value)}
                      className="min-h-[80px] resize-none border-slate-200 focus:border-emerald-300"
                    />
                    <Button
                      onClick={handleSubmitAnswer}
                      disabled={!newAnswer.trim() || isSubmitting}
                      className="bg-emerald-600 hover:bg-emerald-700 shrink-0"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}