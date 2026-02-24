import { motion } from "framer-motion";
import { Bell, Shield, LogOut, Trash2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

const SettingsPage = () => (
  <div className="max-w-2xl mx-auto">
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
      <h1 className="font-display text-2xl font-bold mb-6">Settings</h1>

      <div className="space-y-6">
        {/* Notifications */}
        <div className="glass-card p-5">
          <div className="flex items-center gap-3 mb-4">
            <Bell className="h-5 w-5 text-primary" />
            <h2 className="font-display font-semibold">Notifications</h2>
          </div>
          <div className="space-y-4">
            {["Announcements", "Discussion replies", "Material uploads", "Timetable changes"].map((item) => (
              <div key={item} className="flex items-center justify-between">
                <Label className="text-sm">{item}</Label>
                <Switch defaultChecked />
              </div>
            ))}
          </div>
        </div>

        {/* Class Settings */}
        <div className="glass-card p-5">
          <div className="flex items-center gap-3 mb-4">
            <Users className="h-5 w-5 text-primary" />
            <h2 className="font-display font-semibold">Class</h2>
          </div>
          <div className="space-y-3">
            <Button variant="outline" className="w-full justify-start">Transfer Ownership</Button>
            <Button variant="outline" className="w-full justify-start text-destructive hover:text-destructive">Leave Class</Button>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="glass-card p-5 border-destructive/20">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="h-5 w-5 text-destructive" />
            <h2 className="font-display font-semibold text-destructive">Danger Zone</h2>
          </div>
          <Button variant="outline" className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/5">
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Account
          </Button>
        </div>
      </div>
    </motion.div>
  </div>
);

export default SettingsPage;
