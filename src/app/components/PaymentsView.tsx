import { Room } from '../App';
import { CreditCard, DollarSign, TrendingUp, Calendar } from 'lucide-react';

interface PaymentsViewProps {
  rooms: Room[];
}

export function PaymentsView({ rooms }: PaymentsViewProps) {
  const occupiedRooms = rooms.filter(room => room.status === 'occupied' && room.guest);
  const reservedRooms = rooms.filter(room => room.status === 'reserved' && room.guest);

  const calculateTotal = (room: Room) => {
    if (!room.guest) return 0;
    const checkInDate = new Date(room.guest.checkInDate);
    const checkOutDate = new Date(room.guest.checkOutDate);
    const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 1000 / 24));
    return room.rate * nights;
  };

  const totalRevenue = occupiedRooms.reduce((sum, room) => sum + calculateTotal(room), 0);
  const pendingRevenue = reservedRooms.reduce((sum, room) => sum + calculateTotal(room), 0);
  const expectedRevenue = totalRevenue + pendingRevenue;

  const todayRevenue = occupiedRooms
    .filter(room => room.guest?.checkInDate === new Date().toISOString().split('T')[0])
    .reduce((sum, room) => sum + calculateTotal(room), 0);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Payments & Revenue</h2>
        <p className="text-sm text-gray-600 mt-1">Track payments and financial overview</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <RevenueCard
          icon={<DollarSign className="w-6 h-6" />}
          label="Current Revenue"
          amount={totalRevenue}
          color="green"
          description={`${occupiedRooms.length} occupied rooms`}
        />
        <RevenueCard
          icon={<Calendar className="w-6 h-6" />}
          label="Pending Revenue"
          amount={pendingRevenue}
          color="yellow"
          description={`${reservedRooms.length} reservations`}
        />
        <RevenueCard
          icon={<TrendingUp className="w-6 h-6" />}
          label="Total Expected"
          amount={expectedRevenue}
          color="blue"
          description="Current + Pending"
        />
        <RevenueCard
          icon={<CreditCard className="w-6 h-6" />}
          label="Today's Bookings"
          amount={todayRevenue}
          color="purple"
          description="Revenue from today"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-green-600" />
            Active Payments ({occupiedRooms.length})
          </h3>
          <div className="space-y-3 max-h-[500px] overflow-y-auto">
            {occupiedRooms.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No active payments</p>
            ) : (
              occupiedRooms.map(room => (
                <PaymentCard key={room.id} room={room} status="Active" />
              ))
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-yellow-600" />
            Pending Payments ({reservedRooms.length})
          </h3>
          <div className="space-y-3 max-h-[500px] overflow-y-auto">
            {reservedRooms.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No pending payments</p>
            ) : (
              reservedRooms.map(room => (
                <PaymentCard key={room.id} room={room} status="Pending" />
              ))
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Revenue Breakdown by Room Type</h3>
        <div className="space-y-3">
          {['Suite', 'Deluxe', 'Standard'].map(roomType => {
            const typeRooms = [...occupiedRooms, ...reservedRooms].filter(r => r.type === roomType);
            const typeRevenue = typeRooms.reduce((sum, room) => sum + calculateTotal(room), 0);
            const percentage = expectedRevenue > 0 ? Math.round((typeRevenue / expectedRevenue) * 100) : 0;

            return (
              <div key={roomType}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-700">{roomType}</span>
                  <span className="font-semibold text-gray-900">${typeRevenue} ({percentage}%)</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

interface RevenueCardProps {
  icon: React.ReactNode;
  label: string;
  amount: number;
  color: 'green' | 'yellow' | 'blue' | 'purple';
  description: string;
}

function RevenueCard({ icon, label, amount, color, description }: RevenueCardProps) {
  const colorClasses = {
    green: 'bg-green-100 text-green-700',
    yellow: 'bg-yellow-100 text-yellow-700',
    blue: 'bg-blue-100 text-blue-700',
    purple: 'bg-purple-100 text-purple-700',
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center gap-3 mb-3">
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          {icon}
        </div>
      </div>
      <div className="text-sm text-gray-600 mb-1">{label}</div>
      <div className="text-2xl font-bold text-gray-900 mb-1">${amount}</div>
      <div className="text-xs text-gray-500">{description}</div>
    </div>
  );
}

interface PaymentCardProps {
  room: Room;
  status: 'Active' | 'Pending';
}

function PaymentCard({ room, status }: PaymentCardProps) {
  if (!room.guest) return null;

  const checkInDate = new Date(room.guest.checkInDate);
  const checkOutDate = new Date(room.guest.checkOutDate);
  const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 1000 / 24));
  const total = room.rate * nights;

  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <div>
          <div className="font-semibold text-gray-900">
            Room {room.number} - {room.type}
          </div>
          <div className="text-sm text-gray-600">
            {room.guest.firstName} {room.guest.lastName}
          </div>
        </div>
        <span className={`px-2 py-1 rounded text-xs font-semibold ${
          status === 'Active' 
            ? 'bg-green-100 text-green-800' 
            : 'bg-yellow-100 text-yellow-800'
        }`}>
          {status}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 text-sm mb-2">
        <div>
          <span className="text-gray-600">Check-In:</span>
          <div className="font-medium text-gray-900">{checkInDate.toLocaleDateString()}</div>
        </div>
        <div>
          <span className="text-gray-600">Check-Out:</span>
          <div className="font-medium text-gray-900">{checkOutDate.toLocaleDateString()}</div>
        </div>
      </div>

      <div className="flex justify-between items-center pt-2 border-t border-gray-200">
        <span className="text-sm text-gray-600">{nights} nights × ${room.rate}/night</span>
        <span className="font-bold text-lg text-blue-600">${total}</span>
      </div>
    </div>
  );
}
