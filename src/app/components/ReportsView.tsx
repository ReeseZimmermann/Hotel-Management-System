import { Room } from '../App';
import { FileText, TrendingUp, Users, Hotel, DollarSign, Calendar, Percent } from 'lucide-react';

interface ReportsViewProps {
  rooms: Room[];
}

export function ReportsView({ rooms }: ReportsViewProps) {
  const totalRooms = rooms.length;
  const availableRooms = rooms.filter(r => r.status === 'available').length;
  const occupiedRooms = rooms.filter(r => r.status === 'occupied').length;
  const reservedRooms = rooms.filter(r => r.status === 'reserved').length;
  const cleaningRooms = rooms.filter(r => r.status === 'cleaning').length;
  const maintenanceRooms = rooms.filter(r => r.status === 'maintenance').length;

  const occupancyRate = Math.round((occupiedRooms / totalRooms) * 100);
  const availabilityRate = Math.round((availableRooms / totalRooms) * 100);

  const calculateTotal = (room: Room) => {
    if (!room.guest) return 0;
    const checkInDate = new Date(room.guest.checkInDate);
    const checkOutDate = new Date(room.guest.checkOutDate);
    const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 1000 / 24));
    return room.rate * nights;
  };

  const totalRevenue = [...rooms.filter(r => r.status === 'occupied'), ...rooms.filter(r => r.status === 'reserved')]
    .reduce((sum, room) => sum + calculateTotal(room), 0);

  const averageRate = rooms.reduce((sum, room) => sum + room.rate, 0) / totalRooms;

  const roomTypeBreakdown = {
    Suite: rooms.filter(r => r.type === 'Suite').length,
    Deluxe: rooms.filter(r => r.type === 'Deluxe').length,
    Standard: rooms.filter(r => r.type === 'Standard').length,
  };

  const statusByType = {
    Suite: {
      occupied: rooms.filter(r => r.type === 'Suite' && r.status === 'occupied').length,
      available: rooms.filter(r => r.type === 'Suite' && r.status === 'available').length,
      total: roomTypeBreakdown.Suite,
    },
    Deluxe: {
      occupied: rooms.filter(r => r.type === 'Deluxe' && r.status === 'occupied').length,
      available: rooms.filter(r => r.type === 'Deluxe' && r.status === 'available').length,
      total: roomTypeBreakdown.Deluxe,
    },
    Standard: {
      occupied: rooms.filter(r => r.type === 'Standard' && r.status === 'occupied').length,
      available: rooms.filter(r => r.type === 'Standard' && r.status === 'available').length,
      total: roomTypeBreakdown.Standard,
    },
  };

  const currentGuests = rooms.filter(r => (r.status === 'occupied' || r.status === 'reserved') && r.guest).length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Reports & Analytics</h2>
        <p className="text-sm text-gray-600 mt-1">Comprehensive overview of hotel operations</p>
      </div>

      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg shadow-lg p-6 text-white">
        <div className="flex items-center gap-3 mb-4">
          <FileText className="w-8 h-8" />
          <h3 className="text-xl font-semibold">Executive Summary</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <SummaryItem label="Total Rooms" value={totalRooms} />
          <SummaryItem label="Occupancy Rate" value={`${occupancyRate}%`} />
          <SummaryItem label="Current Guests" value={currentGuests} />
          <SummaryItem label="Total Revenue" value={`$${totalRevenue}`} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard
          icon={<Percent className="w-6 h-6" />}
          title="Occupancy Rate"
          value={`${occupancyRate}%`}
          subtitle={`${occupiedRooms} of ${totalRooms} rooms occupied`}
          color="blue"
        />
        <MetricCard
          icon={<TrendingUp className="w-6 h-6" />}
          title="Availability Rate"
          value={`${availabilityRate}%`}
          subtitle={`${availableRooms} rooms ready to book`}
          color="green"
        />
        <MetricCard
          icon={<DollarSign className="w-6 h-6" />}
          title="Avg. Room Rate"
          value={`$${Math.round(averageRate)}`}
          subtitle="Per night across all types"
          color="purple"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Hotel className="w-5 h-5 text-blue-600" />
            Room Status Distribution
          </h3>
          <div className="space-y-3">
            <StatusRow label="Available" count={availableRooms} total={totalRooms} color="bg-green-500" />
            <StatusRow label="Occupied" count={occupiedRooms} total={totalRooms} color="bg-blue-500" />
            <StatusRow label="Reserved" count={reservedRooms} total={totalRooms} color="bg-yellow-500" />
            <StatusRow label="Cleaning" count={cleaningRooms} total={totalRooms} color="bg-purple-500" />
            <StatusRow label="Maintenance" count={maintenanceRooms} total={totalRooms} color="bg-red-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-green-600" />
            Room Type Breakdown
          </h3>
          <div className="space-y-4">
            {Object.entries(roomTypeBreakdown).map(([type, count]) => (
              <div key={type}>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium text-gray-700">{type}</span>
                  <span className="text-gray-600">{count} rooms</span>
                </div>
                <div className="flex gap-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${(statusByType[type as keyof typeof statusByType].occupied / statusByType[type as keyof typeof statusByType].total) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-600 w-20">
                    {statusByType[type as keyof typeof statusByType].occupied} occupied
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Users className="w-5 h-5 text-purple-600" />
          Guest Statistics
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatBox
            label="Current Guests"
            value={occupiedRooms}
            description="Checked-in today"
            icon={<Users className="w-8 h-8 text-blue-500" />}
          />
          <StatBox
            label="Upcoming Arrivals"
            value={reservedRooms}
            description="Reserved rooms"
            icon={<Calendar className="w-8 h-8 text-yellow-500" />}
          />
          <StatBox
            label="Total Capacity"
            value={totalRooms}
            description="Available rooms"
            icon={<Hotel className="w-8 h-8 text-green-500" />}
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-green-600" />
          Revenue Summary
        </h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
            <div>
              <div className="text-sm text-gray-600">Total Expected Revenue</div>
              <div className="text-2xl font-bold text-green-700">${totalRevenue}</div>
            </div>
            <TrendingUp className="w-10 h-10 text-green-500" />
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-3 bg-gray-50 rounded">
              <div className="text-xs text-gray-600">Avg. Rate</div>
              <div className="text-lg font-semibold text-gray-900">${Math.round(averageRate)}</div>
            </div>
            <div className="p-3 bg-gray-50 rounded">
              <div className="text-xs text-gray-600">Bookings</div>
              <div className="text-lg font-semibold text-gray-900">{occupiedRooms + reservedRooms}</div>
            </div>
            <div className="p-3 bg-gray-50 rounded">
              <div className="text-xs text-gray-600">Revenue/Room</div>
              <div className="text-lg font-semibold text-gray-900">
                ${Math.round(totalRevenue / (occupiedRooms + reservedRooms || 1))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SummaryItem({ label, value }: { label: string; value: string | number }) {
  return (
    <div>
      <div className="text-sm text-blue-100">{label}</div>
      <div className="text-2xl font-bold">{value}</div>
    </div>
  );
}

interface MetricCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  subtitle: string;
  color: 'blue' | 'green' | 'purple';
}

function MetricCard({ icon, title, value, subtitle, color }: MetricCardProps) {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-700',
    green: 'bg-green-100 text-green-700',
    purple: 'bg-purple-100 text-purple-700',
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className={`${colorClasses[color]} p-3 rounded-lg w-fit mb-3`}>
        {icon}
      </div>
      <div className="text-sm text-gray-600 mb-1">{title}</div>
      <div className="text-3xl font-bold text-gray-900 mb-1">{value}</div>
      <div className="text-xs text-gray-500">{subtitle}</div>
    </div>
  );
}

function StatusRow({ label, count, total, color }: { label: string; count: number; total: number; color: string }) {
  const percentage = Math.round((count / total) * 100);
  
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-gray-700">{label}</span>
        <span className="text-gray-900 font-semibold">{count} ({percentage}%)</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`${color} h-2 rounded-full transition-all`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

function StatBox({ label, value, description, icon }: { label: string; value: number; description: string; icon: React.ReactNode }) {
  return (
    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
      <div>{icon}</div>
      <div>
        <div className="text-sm text-gray-600">{label}</div>
        <div className="text-2xl font-bold text-gray-900">{value}</div>
        <div className="text-xs text-gray-500">{description}</div>
      </div>
    </div>
  );
}
