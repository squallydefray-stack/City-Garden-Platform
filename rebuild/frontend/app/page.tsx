import { Garden } from "../../Entities/Garden";
import { Plot } from "../../Entities/Plot";
import Layout from "../layout";

export default function Page() {
  // Example dummy data (replace with API calls if needed)
  const gardens: Garden[] = [
    {
      name: "Central Park Garden",
      description: "A community garden in Central Park",
      latitude: 40.785091,
      longitude: -73.968285,
      is_public: true,
      city: "New York",
      address: "Central Park, NY",
      image_url: "",
      total_plots: 10,
      available_plots: 4,
      status: "active",
    },
  ];

  const plots: Plot[] = [
    {
      garden: "Central Park Garden",
      plot_number: "A1",
      assigned_user: "user123",
      assigned_user_name: "Alice Smith",
      status: "assigned",
      size: "5x5",
      notes: "",
    },
  ];

  return (
    <Layout currentPageName="GardenFinder">
      <div className="max-w-7xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Community Gardens</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gardens.map((garden, idx) => (
            <div key={idx} className="bg-white rounded-lg shadow p-4">
              <h2 className="font-semibold text-lg">{garden.name}</h2>
              <p className="text-sm text-slate-600">{garden.description}</p>
              <p className="text-xs text-slate-400 mt-2">
                {garden.available_plots}/{garden.total_plots} plots available
              </p>
            </div>
          ))}
        </div>

        <h2 className="text-xl font-bold mt-8 mb-4">Plots</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plots.map((plot, idx) => (
            <div key={idx} className="bg-white rounded-lg shadow p-4">
              <h3 className="font-semibold">{plot.plot_number}</h3>
              <p className="text-sm text-slate-600">
                Garden: {plot.garden} | Assigned to: {plot.assigned_user_name || "Available"}
              </p>
              <p className="text-xs text-slate-400 mt-1">Status: {plot.status}</p>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}