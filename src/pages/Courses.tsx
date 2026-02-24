import { motion } from "framer-motion";
import { BookOpen, Plus, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const mockCourses = [
  { id: "1", name: "Database Management Systems", code: "CS301", description: "Relational databases, SQL, normalization, transaction management", materials: 12, discussions: 8 },
  { id: "2", name: "Operating Systems", code: "CS302", description: "Process management, memory, file systems, scheduling algorithms", materials: 9, discussions: 5 },
  { id: "3", name: "Computer Networks", code: "CS303", description: "OSI model, TCP/IP, routing, network security fundamentals", materials: 7, discussions: 11 },
  { id: "4", name: "Software Engineering", code: "CS304", description: "SDLC, agile methodologies, testing, project management", materials: 5, discussions: 3 },
];

const Courses = () => {
  const navigate = useNavigate();

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold">Courses</h1>
          <p className="text-muted-foreground text-sm">Your enrolled courses this semester</p>
        </div>
        <Button className="gradient-primary text-primary-foreground shadow-primary-glow">
          <Plus className="h-4 w-4 mr-2" />
          Add Course
        </Button>
      </motion.div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockCourses.map((c, i) => (
          <motion.div
            key={c.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            whileHover={{ y: -3 }}
            className="glass-card p-5 flex flex-col cursor-pointer group"
            onClick={() => navigate(`/courses/${c.id}`)}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 rounded-lg gradient-primary flex items-center justify-center shadow-primary-glow">
                <BookOpen className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <span className="text-xs font-mono text-muted-foreground">{c.code}</span>
                <h3 className="font-display font-semibold text-sm leading-tight">{c.name}</h3>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mb-4 flex-1">{c.description}</p>
            <div className="flex items-center justify-between text-xs text-muted-foreground border-t border-border pt-3">
              <span>{c.materials} materials</span>
              <span>{c.discussions} discussions</span>
              <ArrowRight className="h-4 w-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Courses;
