import { motion } from "framer-motion";
import { Calendar } from "lucide-react";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const times = ["9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "2:00 PM", "3:00 PM"];

const schedule: Record<string, Record<string, { subject: string; faculty: string; room: string } | null>> = {
  Monday: { "9:00 AM": { subject: "DBMS", faculty: "Dr. Patel", room: "301" }, "10:00 AM": { subject: "OS", faculty: "Prof. Singh", room: "302" }, "11:00 AM": null, "12:00 PM": null, "2:00 PM": { subject: "CN Lab", faculty: "Dr. Kumar", room: "Lab 1" }, "3:00 PM": null },
  Tuesday: { "9:00 AM": { subject: "CN", faculty: "Dr. Kumar", room: "303" }, "10:00 AM": null, "11:00 AM": { subject: "SE", faculty: "Prof. Joshi", room: "301" }, "12:00 PM": null, "2:00 PM": { subject: "DBMS Lab", faculty: "Dr. Patel", room: "Lab 2" }, "3:00 PM": null },
  Wednesday: { "9:00 AM": { subject: "OS", faculty: "Prof. Singh", room: "302" }, "10:00 AM": { subject: "DBMS", faculty: "Dr. Patel", room: "301" }, "11:00 AM": { subject: "CN", faculty: "Dr. Kumar", room: "303" }, "12:00 PM": null, "2:00 PM": null, "3:00 PM": { subject: "SE", faculty: "Prof. Joshi", room: "301" } },
  Thursday: { "9:00 AM": null, "10:00 AM": { subject: "OS Lab", faculty: "Prof. Singh", room: "Lab 1" }, "11:00 AM": null, "12:00 PM": { subject: "CN", faculty: "Dr. Kumar", room: "303" }, "2:00 PM": { subject: "SE", faculty: "Prof. Joshi", room: "301" }, "3:00 PM": null },
  Friday: { "9:00 AM": { subject: "DBMS", faculty: "Dr. Patel", room: "301" }, "10:00 AM": { subject: "OS", faculty: "Prof. Singh", room: "302" }, "11:00 AM": null, "12:00 PM": null, "2:00 PM": null, "3:00 PM": null },
};

const Timetable = () => (
  <div>
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
      <h1 className="font-display text-2xl font-bold">Timetable</h1>
      <p className="text-muted-foreground text-sm">Weekly class schedule</p>
    </motion.div>

    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="glass-card overflow-x-auto">
      <table className="w-full min-w-[700px]">
        <thead>
          <tr className="border-b border-border">
            <th className="p-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Time</th>
            {days.map((d) => (
              <th key={d} className="p-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">{d}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {times.map((time) => (
            <tr key={time} className="border-b border-border/50 last:border-0">
              <td className="p-3 text-sm font-medium text-muted-foreground whitespace-nowrap">{time}</td>
              {days.map((day) => {
                const slot = schedule[day]?.[time];
                return (
                  <td key={day} className="p-2">
                    {slot ? (
                      <div className="bg-primary/8 border border-primary/15 rounded-lg p-2.5 text-xs">
                        <p className="font-semibold text-foreground">{slot.subject}</p>
                        <p className="text-muted-foreground mt-0.5">{slot.faculty}</p>
                        <p className="text-muted-foreground">Room {slot.room}</p>
                      </div>
                    ) : (
                      <div className="h-16" />
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  </div>
);

export default Timetable;
