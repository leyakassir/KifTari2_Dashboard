import { useEffect, useMemo, useState } from "react";
import { Loader2, MapPin, RefreshCcw } from "lucide-react";
import api from "../../api/api";

export default function AdminMunicipalities() {
  const [municipalities, setMunicipalities] = useState([]);
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [creating, setCreating] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({
    name: "",
    centerLat: "",
    centerLng: "",
    radiusKm: "",
  });

  const fetchMunicipalities = async () => {
    try {
      setErrorMessage("");
      const [municipalitiesRes, statsRes] = await Promise.all([
        api.get("/municipality"),
        api.get("/reports/admin/municipality-stats"),
      ]);

      setMunicipalities(municipalitiesRes.data?.municipalities || []);
      setStats(statsRes.data || []);
    } catch (err) {
      console.error(err);
      setErrorMessage(
        err.response?.data?.message || "Failed to load municipalities"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMunicipalities();
  }, []);

  const rows = useMemo(() => {
    const statsById = new Map();
    stats.forEach((stat) => {
      if (stat?.municipalityId) {
        statsById.set(stat.municipalityId, stat);
      }
    });

    return municipalities.map((municipality) => {
      const stat = statsById.get(municipality._id) || {};
      const pending = stat.pending || 0;
      const inProgress = stat.inProgress || 0;
      const unresolved = pending + inProgress;

      return {
        id: municipality._id,
        name: municipality.name || "N/A",
        isActive: municipality.isActive !== false,
        employer: municipality.assignedEmployerId
          ? `${municipality.assignedEmployerId.firstName || ""} ${municipality.assignedEmployerId.lastName || ""}`.trim()
          : "Unassigned",
        totalReports: stat.totalReports || 0,
        unresolved,
        resolved: stat.resolved || 0,
        centerLat: municipality.centerLat ?? null,
        centerLng: municipality.centerLng ?? null,
        radiusKm: municipality.radiusKm ?? null,
      };
    });
  }, [municipalities, stats]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.name) {
      alert("Municipality name is required");
      return;
    }

    try {
      setCreating(true);
      await api.post("/municipality/add", {
        name: form.name,
        centerLat: form.centerLat ? Number(form.centerLat) : null,
        centerLng: form.centerLng ? Number(form.centerLng) : null,
        radiusKm: form.radiusKm ? Number(form.radiusKm) : null,
      });
      setForm({ name: "", centerLat: "", centerLng: "", radiusKm: "" });
      await fetchMunicipalities();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to create municipality");
    } finally {
      setCreating(false);
    }
  };

  const handleSelect = (row) => {
    setSelected(row);
  };

  const handleUpdateCoordinates = async (e) => {
    e.preventDefault();
    if (!selected?.id) return;

    try {
      setUpdatingId(selected.id);
      await api.patch(`/municipality/${selected.id}/coordinates`, {
        centerLat: selected.centerLat ?? null,
        centerLng: selected.centerLng ?? null,
        radiusKm: selected.radiusKm ?? null,
      });
      await fetchMunicipalities();
      setSelected(null);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to update coordinates");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleToggleStatus = async (row) => {
    const nextActive = !row.isActive;
    const confirmed = window.confirm(
      nextActive
        ? "Reactivate this municipality?"
        : "Deactivate this municipality?"
    );
    if (!confirmed) return;

    try {
      setUpdatingId(row.id);
      await api.patch(`/municipality/${row.id}/status`, {
        isActive: nextActive,
      });
      await fetchMunicipalities();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to update municipality");
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-8 flex justify-center">
        <Loader2 className="animate-spin text-slate-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <MapPin size={18} className="text-primary" />
          <div className="font-semibold text-slate-900">
            Create Municipality
          </div>
        </div>
        <form
          onSubmit={handleCreate}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          <input
            className="border rounded-lg px-4 py-2 w-full"
            placeholder="Municipality Name"
            value={form.name}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, name: e.target.value }))
            }
          />
          <input
            className="border rounded-lg px-4 py-2 w-full"
            placeholder="Center Latitude"
            value={form.centerLat}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, centerLat: e.target.value }))
            }
          />
          <input
            className="border rounded-lg px-4 py-2 w-full"
            placeholder="Center Longitude"
            value={form.centerLng}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, centerLng: e.target.value }))
            }
          />
          <input
            className="border rounded-lg px-4 py-2 w-full"
            placeholder="Radius (km)"
            value={form.radiusKm}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, radiusKm: e.target.value }))
            }
          />
          <div className="md:col-span-2 lg:col-span-4">
            <button
              disabled={creating}
              className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primarySoft disabled:opacity-50"
            >
              {creating ? "Creating..." : "Create Municipality"}
            </button>
          </div>
        </form>
      </div>

      {selected ? (
        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="font-semibold text-slate-900">
              Update Coordinates: {selected.name}
            </div>
            <button
              onClick={() => setSelected(null)}
              className="text-sm text-slate-500 hover:text-slate-700"
            >
              Cancel
            </button>
          </div>
          <form
            onSubmit={handleUpdateCoordinates}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4"
          >
            <input
              className="border rounded-lg px-4 py-2 w-full"
              placeholder="Center Latitude"
              value={selected.centerLat ?? ""}
              onChange={(e) =>
                setSelected((prev) => ({
                  ...prev,
                  centerLat: e.target.value,
                }))
              }
            />
            <input
              className="border rounded-lg px-4 py-2 w-full"
              placeholder="Center Longitude"
              value={selected.centerLng ?? ""}
              onChange={(e) =>
                setSelected((prev) => ({
                  ...prev,
                  centerLng: e.target.value,
                }))
              }
            />
            <input
              className="border rounded-lg px-4 py-2 w-full"
              placeholder="Radius (km)"
              value={selected.radiusKm ?? ""}
              onChange={(e) =>
                setSelected((prev) => ({
                  ...prev,
                  radiusKm: e.target.value,
                }))
              }
            />
            <div className="md:col-span-2 lg:col-span-4">
              <button
                disabled={updatingId === selected.id}
                className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primarySoft disabled:opacity-50"
              >
                {updatingId === selected.id ? "Updating..." : "Update Coordinates"}
              </button>
            </div>
          </form>
        </div>
      ) : null}

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        {errorMessage ? (
          <div className="px-6 py-4 text-sm text-red-600">
            {errorMessage}
          </div>
        ) : null}

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b">
              <tr className="text-left text-slate-600">
                <th className="px-6 py-3">Municipality</th>
                <th className="px-6 py-3">Assigned Employer</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Total Reports</th>
                <th className="px-6 py-3">Unresolved</th>
                <th className="px-6 py-3">Resolved</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {rows.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-medium text-slate-900">
                    {row.name}
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    {row.employer || "Unassigned"}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={[
                        "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium",
                        row.isActive
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-rose-50 text-rose-700",
                      ].join(" ")}
                    >
                      {row.isActive ? "Active" : "Deactivated"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    {row.totalReports}
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    {row.unresolved}
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    {row.resolved}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap justify-end gap-2">
                      <button
                        onClick={() => handleSelect(row)}
                        className="px-3 py-2 border border-slate-200 rounded-lg text-sm hover:bg-slate-50"
                      >
                        Edit Coordinates
                      </button>
                      <button
                        onClick={() => handleToggleStatus(row)}
                        disabled={updatingId === row.id}
                        className={[
                          "px-3 py-2 rounded-lg border text-sm",
                          row.isActive
                            ? "border-rose-200 text-rose-700 hover:bg-rose-50"
                            : "border-emerald-200 text-emerald-700 hover:bg-emerald-50",
                          updatingId === row.id ? "opacity-60" : "",
                        ].join(" ")}
                      >
                        {updatingId === row.id
                          ? "Updating..."
                          : row.isActive
                          ? "Deactivate"
                          : "Reactivate"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
