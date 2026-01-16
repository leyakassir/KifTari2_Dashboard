import { motion } from "framer-motion";
import { FileText } from "lucide-react";

const accentMap = {
  blue: "border-blue-600 text-blue-600",
  orange: "border-orange-500 text-orange-500",
  green: "border-green-600 text-green-600",
};

export default function StatCard({ title, value, accent = "blue" }) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.15 }}
      className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>
          <p className="mt-2 text-3xl font-bold text-slate-900">
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
