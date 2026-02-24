import { motion } from "framer-motion";
import { FolderOpen, Upload, FileText, Image, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

const mockMaterials = [
  { id: 1, name: "DBMS Unit 1 Notes.pdf", type: "PDF", size: "2.4 MB", uploader: "Dr. Patel", date: "Mar 2, 2024", course: "DBMS" },
  { id: 2, name: "ER Diagram Examples.pptx", type: "PPTX", size: "5.1 MB", uploader: "Dr. Patel", date: "Mar 1, 2024", course: "DBMS" },
  { id: 3, name: "OS Process Scheduling.pdf", type: "PDF", size: "1.8 MB", uploader: "Prof. Singh", date: "Feb 28, 2024", course: "OS" },
  { id: 4, name: "Network Topology Diagram.png", type: "PNG", size: "890 KB", uploader: "Dr. Kumar", date: "Feb 27, 2024", course: "CN" },
];

const getIcon = (type: string) => {
  if (type === "PNG" || type === "JPG") return Image;
  return FileText;
};

const Materials = () => (
  <div>
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Materials</h1>
        <p className="text-muted-foreground text-sm">All uploaded course materials</p>
      </div>
      <Button className="gradient-primary text-primary-foreground shadow-primary-glow">
        <Upload className="h-4 w-4 mr-2" />
        Upload
      </Button>
    </motion.div>

    <div className="glass-card divide-y divide-border">
      {mockMaterials.map((m, i) => {
        const Icon = getIcon(m.type);
        return (
          <motion.div
            key={m.id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.06 }}
            className="flex items-center gap-4 p-4 hover:bg-secondary/30 transition-colors"
          >
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Icon className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{m.name}</p>
              <p className="text-xs text-muted-foreground">{m.course} · {m.uploader} · {m.date}</p>
            </div>
            <span className="text-xs text-muted-foreground hidden sm:block">{m.size}</span>
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
              <Download className="h-4 w-4" />
            </Button>
          </motion.div>
        );
      })}
    </div>
  </div>
);

export default Materials;
