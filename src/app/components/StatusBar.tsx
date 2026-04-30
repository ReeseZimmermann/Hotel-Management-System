import { Room } from '../App';

interface StatusBarProps {
  rooms: Room[];
}

export function StatusBar({ rooms }: StatusBarProps) {
  const availableRooms = rooms.filter(r => r.status === 'available').length;
  const occupiedRooms = rooms.filter(r => r.status === 'occupied').length;
  const reservedRooms = rooms.filter(r => r.status === 'reserved').length;
  const cleaningRooms = rooms.filter(r => r.status === 'cleaning').length;
  const maintenanceRooms = rooms.filter(r => r.status === 'maintenance').length;
  const totalRooms = rooms.length;

  return (
    <div className="flex items-center justify-between flex-wrap gap-4">
      <div className="flex items-center gap-6 flex-wrap">
        <StatusItem 
          label="Available" 
          count={availableRooms} 
          color="bg-green-500"
          textColor="text-green-700"
        />
        <StatusItem 
          label="Occupied" 
          count={occupiedRooms} 
          color="bg-blue-500"
          textColor="text-blue-700"
        />
        <StatusItem 
          label="Reserved" 
          count={reservedRooms} 
          color="bg-yellow-500"
          textColor="text-yellow-700"
        />
        <StatusItem 
          label="Cleaning" 
          count={cleaningRooms} 
          color="bg-purple-500"
          textColor="text-purple-700"
        />
        <StatusItem 
          label="Maintenance" 
          count={maintenanceRooms} 
          color="bg-red-500"
          textColor="text-red-700"
        />
      </div>
      
      <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg">
        <span className="text-xs font-medium text-gray-600">Total:</span>
        <span className="text-sm font-bold text-gray-900">{totalRooms}</span>
      </div>
    </div>
  );
}

interface StatusItemProps {
  label: string;
  count: number;
  color: string;
  textColor: string;
}

function StatusItem({ label, count, color, textColor }: StatusItemProps) {
  return (
    <div className="flex items-center gap-2">
      <div className={`w-2.5 h-2.5 rounded-full ${color}`} />
      <span className="text-xs font-medium text-gray-600">{label}</span>
      <span className={`text-sm font-bold ${textColor}`}>{count}</span>
    </div>
  );
}