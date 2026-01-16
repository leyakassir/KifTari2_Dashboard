import { useEffect, useState } from "react";
import api from "../../api/api";
import { X } from "lucide-react";

export default function AssignOperatorModal({
  report,
  onClose,
  onAssigned,
}) {
  const [operators, setOperators] = useState([]);
  const [selectedOperatorId, setSelectedOperatorId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* ================= FETCH OPERATORS ================= */
  useEffect(() => {
    const fetchOperators = async () => {
      try {
        const res = await api.get("/auth/employer/operators");
        setOperators(res.data.operators || []);
      } catch (err) {
        console.error("Failed to load operators", err);
        setError("Failed to load field operators");
      }
    };

    fetchOperators();
  }, []);

  /* ================= ASSIGN / CHANGE ================= */
  const handleAssign = async () => {
    if (!selectedOperatorId) return;

    try {
      setLoading(true);
      setError("");

      // ✅ EXACT payload backend expects
      const res = await api.post("/reports/assign", {
        reportId: report._id,
        operatorId: selectedOperatorId,
      });

      if (!res.data || res.data.success === false) {
        throw new Error("Assignment failed");
      }

      const assignedOperator = operators.find(
        (op) => op._id === selectedOperatorId
      );

      // ✅ Update UI state
      onAssigned(report._id, assignedOperator);

      onClose();
    } catch (err) {
      console.error("Assign failed:", err);
      setError("Failed to assign field operator");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-md p-6 space-y-5">
        {/* HEADER */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">
            Assign Field Operator
          </h3>
          <button onClick={onClose}>
            <X />
          </button>
        </div>

        {/* SELECT */}
        <div>
          <label className="block text-sm text-slate-600 mb-1">
            Field Operator
          </label>
          <select
            value={selectedOperatorId}
            onChange={(e) => setSelectedOperatorId(e.target.value)}
            className="w-full border rounded-lg px-3 py-2"
          >
            <option value="">Select operator</option>
            {operators.map((op) => (
              <option key={op._id} value={op._id}>
                {op.firstName} {op.lastName}
              </option>
            ))}
          </select>
        </div>

        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}

        {/* ACTIONS */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border"
            disabled={loading}
          >
            Cancel
          </button>

          <button
            onClick={handleAssign}
            disabled={!selectedOperatorId || loading}
            className="px-4 py-2 rounded-lg bg-primary text-white disabled:opacity-50"
          >
            {loading ? "Assigning..." : "Assign"}
          </button>
        </div>
      </div>
    </div>
  );
}
