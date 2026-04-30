import { Room } from '../App';
import { Home, Users, Calendar, Clock, ChevronRight } from 'lucide-react';

interface DashboardProps {
  rooms: Room[];
  onNavigateToRooms: () => void;
  onNavigateToReservations?: () => void;
}

export function Dashboard({ rooms, onNavigateToRooms, onNavigateToReservations }: DashboardProps) {
  const availableRooms = rooms.filter(r => r.status === 'available').length;
  const occupiedRooms = rooms.filter(r => r.status === 'occupied').length;
  const reservedRooms = rooms.filter(r => r.status === 'reserved').length;
  const cleaningRooms = rooms.filter(r => r.status === 'cleaning').length;
  const totalRooms = rooms.length;
  const occupancyRate = Math.round((occupiedRooms / totalRooms) * 100);

  const todayCheckIns = rooms.filter(r => 
    r.status === 'reserved' && r.guest?.checkInDate === new Date().toISOString().split('T')[0]
  ).length;

  const todayCheckOuts = rooms.filter(r => 
    r.status === 'occupied' && r.guest?.checkOutDate === new Date().toISOString().split('T')[0]
  ).length;

  return (
    <div className="space-y-12">
      {/* Overview Stats - No cards, just flat layout */}
      <div>
        <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-6">Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <StatItem
            icon={<Home className="w-5 h-5" />}
            title="Available"
            value={availableRooms}
            subtitle={`${availableRooms} of ${totalRooms} rooms`}
            color="text-green-600"
            bgColor="bg-green-50"
          />
          <StatItem
            icon={<Users className="w-5 h-5" />}
            title="Occupied"
            value={occupiedRooms}
            subtitle={`${occupancyRate}% occupancy`}
            color="text-blue-600"
            bgColor="bg-blue-50"
          />
          <StatItem
            icon={<Calendar className="w-5 h-5" />}
            title="Reserved"
            value={reservedRooms}
            subtitle="Upcoming reservations"
            color="text-yellow-600"
            bgColor="bg-yellow-50"
          />
          <StatItem
            icon={<Clock className="w-5 h-5" />}
            title="Cleaning"
            value={cleaningRooms}
            subtitle="Being prepared"
            color="text-purple-600"
            bgColor="bg-purple-50"
          />
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200" />

      {/* Today's Activity & Room Status - Side by side, flat */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Today's Activity */}
        <div>
          <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-6">Today's Activity</h3>
          <div className="space-y-4">
            <button
              onClick={onNavigateToReservations}
              className="w-full flex justify-between items-center py-3 hover:bg-gray-50 transition-colors rounded-lg px-2 group"
            >
              <span className="text-sm text-gray-700 group-hover:text-gray-900">Check-ins Expected</span>
              <div className="flex items-center gap-2">
                <span className="text-lg font-semibold text-green-600">{todayCheckIns}</span>
                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-700" />
              </div>
            </button>
            <div className="h-px bg-gray-200" />
            <div className="flex justify-between items-center py-3">
              <span className="text-sm text-gray-700">Check-outs Expected</span>
              <span className="text-lg font-semibold text-blue-600">{todayCheckOuts}</span>
            </div>
          </div>
        </div>

        {/* Room Status Summary */}
        <div>
          <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-6">Room Status Summary</h3>
          <div className="space-y-4">
            <StatusBarItem label="Available" count={availableRooms} total={totalRooms} color="bg-green-500" />
            <StatusBarItem label="Occupied" count={occupiedRooms} total={totalRooms} color="bg-blue-500" />
            <StatusBarItem label="Reserved" count={reservedRooms} total={totalRooms} color="bg-yellow-500" />
            <StatusBarItem label="Cleaning" count={cleaningRooms} total={totalRooms} color="bg-purple-500" />
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200" />

      {/* Quick Actions - Flat buttons */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-6">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <button
            onClick={onNavigateToRooms}
            className="group text-left py-4 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-gray-900 mb-1">Check-In Guest</div>
                <div className="text-sm text-gray-600">Register new arrival</div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-700 transition-colors" />
            </div>
          </button>
          
          <button
            onClick={onNavigateToRooms}
            className="group text-left py-4 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-gray-900 mb-1">Check-Out Guest</div>
                <div className="text-sm text-gray-600">Process departure</div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-700 transition-colors" />
            </div>
          </button>
          
          <button
            onClick={onNavigateToRooms}
            className="group text-left py-4 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-gray-900 mb-1">New Reservation</div>
                <div className="text-sm text-gray-600">Book a room</div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-700 transition-colors" />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

interface StatItemProps {
  icon: React.ReactNode;
  title: string;
  value: number;
  subtitle: string;
  color: string;
  bgColor: string;
}

function StatItem({ icon, title, value, subtitle, color, bgColor }: StatItemProps) {
  return (
    <div className="flex items-start gap-4">
      <div className={`p-2.5 rounded-lg ${bgColor} ${color} opacity-80`}>
        {icon}
      </div>
      <div className="flex-1">
        <div className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-1">{title}</div>
        <div className={`text-3xl font-bold ${color} mb-0.5`}>{value}</div>
        <div className="text-xs text-gray-500">{subtitle}</div>
      </div>
    </div>
  );
}

interface StatusBarItemProps {
  label: string;
  count: number;
  total: number;
  color: string;
}

function StatusBarItem({ label, count, total, color }: StatusBarItemProps) {
  const percentage = (count / total) * 100;

  return (
    <div>
      <div className="flex justify-between items-baseline mb-2">
        <span className="text-sm text-gray-700">{label}</span>
        <span className="text-sm font-semibold text-gray-900">{count}</span>
      </div>
      <div className="w-full bg-gray-100 h-1.5">
        <div
          className={`${color} h-1.5 transition-all opacity-80`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}