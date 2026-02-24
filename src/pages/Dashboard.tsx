import { motion } from "framer-motion";
import { BookOpen, Megaphone, MessageCircle, Calendar, Plus, KeyRound } from "lucide-react";
import { useState } from "react";
import { StatCard } from "@/components/StatCard";
import { EmptyState } from "@/components/EmptyState";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const Dashboard = () => {
  const [hasClass, setHasClass] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [showJoin, setShowJoin] = useState(false);

  // Mock: no class state
  if (!hasClass) {
    return (
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="font-display text-3xl font-bold mb-2">Welcome to ClassHub</h1>
          <p className="text-muted-foreground mb-8">Get started by creating or joining a class.</p>

          <div className="grid sm:grid-cols-2 gap-4">
            {/* Create Class */}
            <Dialog open={showCreate} onOpenChange={setShowCreate}>
              <DialogTrigger asChild>
                <motion.button
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="glass-card p-6 text-left hover:shadow-card-hover transition-all group"
                >
                  <div className="h-12 w-12 rounded-xl gradient-primary flex items-center justify-center mb-4 shadow-primary-glow group-hover:scale-105 transition-transform">
                    <Plus className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <h3 className="font-display font-semibold text-lg mb-1">Create a Class</h3>
                  <p className="text-sm text-muted-foreground">Set up a new classroom for your department</p>
                </motion.button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="font-display">Create a New Class</DialogTitle>
                  <DialogDescription>Fill in the details. Class creation requires admin approval.</DialogDescription>
                </DialogHeader>
                <form className="space-y-4 mt-2">
                  <div className="space-y-2">
                    <Label>College Name</Label>
                    <Input placeholder="MIT College of Engineering" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label>Department</Label>
                      <Input placeholder="Computer Science" />
                    </div>
                    <div className="space-y-2">
                      <Label>Year</Label>
                      <Input placeholder="3rd Year" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Section</Label>
                    <Input placeholder="A" />
                  </div>
                  <Button type="button" className="w-full gradient-primary text-primary-foreground" onClick={() => { setShowCreate(false); setHasClass(true); }}>
                    Submit for Approval
                  </Button>
                </form>
              </DialogContent>
            </Dialog>

            {/* Join Class */}
            <Dialog open={showJoin} onOpenChange={setShowJoin}>
              <DialogTrigger asChild>
                <motion.button
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="glass-card p-6 text-left hover:shadow-card-hover transition-all group"
                >
                  <div className="h-12 w-12 rounded-xl bg-accent/20 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                    <KeyRound className="h-6 w-6 text-accent-foreground" />
                  </div>
                  <h3 className="font-display font-semibold text-lg mb-1">Join a Class</h3>
                  <p className="text-sm text-muted-foreground">Enter a class code shared by your classmate</p>
                </motion.button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="font-display">Join a Class</DialogTitle>
                  <DialogDescription>Enter the unique class code to join.</DialogDescription>
                </DialogHeader>
                <form className="space-y-4 mt-2">
                  <div className="space-y-2">
                    <Label>Class Code</Label>
                    <Input placeholder="e.g. CS-2024-A3" />
                  </div>
                  <Button type="button" className="w-full gradient-primary text-primary-foreground" onClick={() => { setShowJoin(false); setHasClass(true); }}>
                    Join Class
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </motion.div>
      </div>
    );
  }

  // Has class: show dashboard overview
  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="font-display text-3xl font-bold mb-1">Dashboard</h1>
        <p className="text-muted-foreground mb-6">CS — 3rd Year — Section A</p>
      </motion.div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="Courses" value={6} icon={BookOpen} description="Active this semester" index={0} />
        <StatCard title="Announcements" value={12} icon={Megaphone} description="This week" index={1} />
        <StatCard title="Discussions" value={34} icon={MessageCircle} description="Active threads" index={2} />
        <StatCard title="Upcoming" value={3} icon={Calendar} description="Classes today" index={3} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Announcements */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-5"
        >
          <h2 className="font-display font-semibold text-lg mb-4">Recent Announcements</h2>
          <div className="space-y-3">
            {["Mid-sem exam schedule released", "Lab submission deadline extended", "Guest lecture on Friday"].map((a, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors">
                <div className="h-2 w-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium">{a}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{i + 1}h ago</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent Discussions */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card p-5"
        >
          <h2 className="font-display font-semibold text-lg mb-4">Active Discussions</h2>
          <div className="space-y-3">
            {["How to solve Q5 in assignment 3?", "Best resources for DBMS prep", "Project team formation"].map((d, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors">
                <div className="h-8 w-8 rounded-full gradient-primary flex items-center justify-center flex-shrink-0 text-xs text-primary-foreground font-bold">
                  {String.fromCharCode(65 + i)}
                </div>
                <div>
                  <p className="text-sm font-medium">{d}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{(i + 1) * 3} replies</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
