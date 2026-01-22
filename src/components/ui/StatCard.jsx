import { motion } from "framer-motion";
import { FileText } from "lucide-react";

const accentMap = {
  blue: "border-emerald-400/50 text-emerald-200",
  orange: "border-emerald-400/50 text-emerald-200",
  green: "border-emerald-400/50 text-emerald-200",
};

export default function StatCard({ title, value, accent = "blue" }) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.15 }}
      className="bg-slate-900/50 rounded-2xl shadow-sm border border-slate-800/60 p-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-400">
            {title}
          </p>
          <p className="mt-2 text-3xl font-bold text-slate-100">
            {value}
          </p>
        </div>

        <div
          className={[
            "h-12 w-12 rounded-xl flex items-center justify-center border",
            accentMap[accent],
          ].join(" ")}
        >
          <FileText size={20} />
        </div>
      </div>
    </motion.div>
  );
}
