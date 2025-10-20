function StatCard({ label, value, icon: Icon, color }: { label: string; value: number | string; icon: React.ElementType; color: string }) {
  return (
    <div className=" p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
      <div className={`p-3 rounded-lg ${color.replace('text', 'bg').replace('-500', '-100')}`}>
         <Icon className={`w-6 h-6 ${color}`} />
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
      </div>
    </div>
  );
}

export default StatCard;