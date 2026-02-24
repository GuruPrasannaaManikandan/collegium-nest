import { motion } from "framer-motion";
import { User, Mail, Phone, MapPin, BookOpen, GraduationCap, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";

const Profile = () => (
  <div className="max-w-2xl mx-auto">
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
      <h1 className="font-display text-2xl font-bold mb-6">Profile</h1>

      <div className="glass-card p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="h-20 w-20 rounded-2xl gradient-primary flex items-center justify-center shadow-primary-glow">
            <User className="h-10 w-10 text-primary-foreground" />
          </div>
          <div>
            <h2 className="font-display text-xl font-bold">Rahul Mehta</h2>
            <p className="text-muted-foreground text-sm">Roll No: 21CS045</p>
          </div>
          <Button variant="outline" size="sm" className="ml-auto">
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
        </div>

        <div className="grid gap-4">
          {[
            { icon: Mail, label: "Email", value: "rahul.mehta@college.edu" },
            { icon: Phone, label: "Phone", value: "+91 98765 43210" },
            { icon: GraduationCap, label: "Department", value: "Computer Science — 3rd Year, Section A" },
            { icon: BookOpen, label: "College", value: "MIT College of Engineering" },
            { icon: MapPin, label: "Address", value: "Pune, Maharashtra, India" },
          ].map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.06 }}
              className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50"
            >
              <item.icon className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">{item.label}</p>
                <p className="text-sm font-medium">{item.value}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  </div>
);

export default Profile;
