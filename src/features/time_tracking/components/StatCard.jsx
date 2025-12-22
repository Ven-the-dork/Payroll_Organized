// src/pages/admin/timetracking/components/StatCard.jsx
export default function StatCard({ icon: Icon, color, value, label }) {
  const styles = {
    green: "bg-green-600 shadow-green-100 text-white",
    yellow: "bg-yellow-400 shadow-yellow-100 text-green-900",
    purple: "bg-purple-600 shadow-purple-100 text-white",
    red: "bg-red-500 shadow-red-100 text-white",
  };

  const activeStyle = styles[color] || styles.green;

  return (
    <div
      className={`rounded-2xl p-5 shadow-lg relative overflow-hidden group transition-transform hover:-translate-y-1 ${activeStyle}`}
    >
      <div className="relative z-10 flex flex-col h-full justify-between">
        <div className="flex justify-between items-start mb-2">
          <div className="p-2 bg-white/20 rounded-lg backdrop-blur-md">
            <Icon size={22} />
          </div>
        </div>
        <div>
          <div className="text-3xl font-extrabold mb-1 tracking-tight">
            {value}
          </div>
          <p className="text-sm font-bold opacity-90 uppercase tracking-wide">
            {label}
          </p>
        </div>
      </div>
      <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all duration-500" />
    </div>
  );
}
