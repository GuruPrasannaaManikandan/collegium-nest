import { motion } from "framer-motion";
import { MessageCircle, Plus, ThumbsUp } from "lucide-react";
import { Button } from "@/components/ui/button";

const mockDiscussions = [
  { id: 1, title: "How to solve Q5 in DBMS Assignment 3?", author: "Rahul M.", replies: 7, helpful: 3, course: "DBMS", time: "2h ago" },
  { id: 2, title: "Best resources for OS process scheduling", author: "Priya S.", replies: 12, helpful: 8, course: "OS", time: "5h ago" },
  { id: 3, title: "Project team formation for SE", author: "Amit K.", replies: 4, helpful: 1, course: "SE", time: "1d ago" },
  { id: 4, title: "TCP vs UDP - when to use what?", author: "Sneha R.", replies: 9, helpful: 6, course: "CN", time: "2d ago" },
];

const Discussions = () => (
  <div>
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Discussions</h1>
        <p className="text-muted-foreground text-sm">Ask questions and share knowledge</p>
      </div>
      <Button className="gradient-primary text-primary-foreground shadow-primary-glow">
        <Plus className="h-4 w-4 mr-2" />
        New Question
      </Button>
    </motion.div>

    <div className="space-y-3">
      {mockDiscussions.map((d, i) => (
        <motion.div
          key={d.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.07 }}
          className="glass-card p-5 hover:shadow-card-hover transition-shadow cursor-pointer"
        >
          <div className="flex items-start gap-4">
            <div className="h-10 w-10 rounded-full gradient-primary flex items-center justify-center text-sm text-primary-foreground font-bold flex-shrink-0">
              {d.author[0]}
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-sm mb-1">{d.title}</h3>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span>{d.author}</span>
                <span>·</span>
                <span className="font-mono">{d.course}</span>
                <span>·</span>
                <span>{d.time}</span>
              </div>
            </div>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <MessageCircle className="h-3.5 w-3.5" /> {d.replies}
              </span>
              <span className="flex items-center gap-1">
                <ThumbsUp className="h-3.5 w-3.5" /> {d.helpful}
              </span>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  </div>
);

export default Discussions;
