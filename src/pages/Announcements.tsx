import { motion } from "framer-motion";
import { Plus, Megaphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/EmptyState";

const mockAnnouncements = [
  { id: 1, title: "Mid-Semester Exam Schedule", content: "The mid-semester exams will begin from March 15th. Please check the detailed schedule on the notice board.", author: "Prof. Sharma", time: "2 hours ago" },
  { id: 2, title: "Lab Submission Deadline Extended", content: "The deadline for DBMS lab assignment 4 has been extended to March 10th.", author: "Dr. Patel", time: "5 hours ago" },
  { id: 3, title: "Guest Lecture: AI in Healthcare", content: "We have a guest lecture this Friday at 2 PM in Seminar Hall. Attendance is mandatory for all CS students.", author: "HOD Office", time: "1 day ago" },
];

const Announcements = () => {
  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold">Announcements</h1>
          <p className="text-muted-foreground text-sm">Stay updated with the latest news</p>
        </div>
        <Button className="gradient-primary text-primary-foreground shadow-primary-glow">
          <Plus className="h-4 w-4 mr-2" />
          New Post
        </Button>
      </motion.div>

      <div className="space-y-4">
        {mockAnnouncements.map((a, i) => (
          <motion.div
            key={a.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="glass-card p-5 hover:shadow-card-hover transition-shadow"
          >
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-display font-semibold">{a.title}</h3>
              <span className="text-xs text-muted-foreground whitespace-nowrap ml-4">{a.time}</span>
            </div>
            <p className="text-sm text-muted-foreground mb-3">{a.content}</p>
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-full gradient-primary flex items-center justify-center text-[10px] text-primary-foreground font-bold">
                {a.author[0]}
              </div>
              <span className="text-xs font-medium">{a.author}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Announcements;
