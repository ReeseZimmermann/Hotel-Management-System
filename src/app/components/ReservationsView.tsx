import { Room } from '../App';
import { Calendar, User, Phone, Mail, DoorOpen, X, AlertCircle } from 'lucide-react';

interface ReservationsViewProps {
  rooms: Room[];
  onCheckIn: (room: Room) => void;
  onCancelReservation: (roomId: number) => void;
}

export function ReservationsView({ rooms, onCheckIn, onCancelReservation }: ReservationsViewProps) {
  // Get all reserved rooms with guest data
  const reservedRooms = rooms.filter(room => room.status === 'reserved' && room.guest);

  // Get today's date normalized to midnight
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayString = today.toISOString().split('T')[0];

  // Filter upcoming reservations (today or future)
  const upcomingReservations = reservedRooms.filter(room => {
    if (!room.guest) return false;
    const checkInDate = new Date(room.guest.checkInDate);
    checkInDate.setHours(0, 0, 0, 0);
    return checkInDate >= today;
  }).sort((a, b) => {
    if (!a.guest || !b.guest) return 0;
    return new Date(a.guest.checkInDate).getTime() - new Date(b.guest.checkInDate).getTime();
  });

  // Filter today's check-ins
  const todayCheckIns = upcomingReservations.filter(room => {
    if (!room.guest) return false;
    return room.guest.checkInDate === todayString;
  });

  // Debug info
  const debugInfo = {
    totalReserved: reservedRooms.length,
    upcoming: upcomingReservations.length,
    today: todayCheckIns.length,
    todayDate: todayString,
  };

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Reservations</h2>
          <p className="text-sm text-gray-600 mt-1">Manage upcoming reservations and check-ins</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 rounded-lg">
          <span className="text-sm font-medium text-gray-600">Active:</span>
          <span className="text-sm font-bold text-blue-600">{upcomingReservations.length}</span>
        </div>
      </div>

      {/* Today's Check-Ins Section */}
      {todayCheckIns.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-6">
            <Calendar className="w-5 h-5 text-green-600" />
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
              Today's Expected Check-Ins ({todayCheckIns.length})
            </h3>
          </div>
          <div className="space-y-4">
            {todayCheckIns.map(room => (
              <ReservationItem
                key={room.id}
                room={room}
                onCheckIn={onCheckIn}
                onCancel={onCancelReservation}
                isToday={true}
              />
            ))}
          </div>
        </div>
      )}

      {/* Divider if there are today's check-ins */}
      {todayCheckIns.length > 0 && <div className="border-t border-gray-200" />}

      {/* All Upcoming Reservations Section */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-6">
          All Upcoming Reservations
        </h3>
        
        {upcomingReservations.length === 0 ? (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
              <Calendar className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 mb-4">No upcoming reservations</p>
            
            {/* Debug info */}
            <details className="mt-6 text-left max-w-md mx-auto">
              <summary className="cursor-pointer text-xs text-gray-400 hover:text-gray-600 flex items-center gap-2 justify-center">
                <AlertCircle className="w-3 h-3" />
                Debug Info
              </summary>
              <div className="mt-2 p-3 bg-gray-50 rounded text-xs font-mono text-gray-600 space-y-1">
                <div>Total reserved rooms: {debugInfo.totalReserved}</div>
                <div>Upcoming reservations: {debugInfo.upcoming}</div>
                <div>Today's check-ins: {debugInfo.today}</div>
                <div>Today's date: {debugInfo.todayDate}</div>
                {reservedRooms.map(room => (
                  <div key={room.id} className="mt-2 pt-2 border-t border-gray-200">
                    Room {room.number}: Check-in {room.guest?.checkInDate}
                  </div>
                ))}
              </div>
            </details>
          </div>
        ) : (
          <div className="space-y-4">
            {upcomingReservations.map(room => (
              <ReservationItem
                key={room.id}
                room={room}
                onCheckIn={onCheckIn}
                onCancel={onCancelReservation}
                isToday={room.guest?.checkInDate === todayString}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

interface ReservationItemProps {
  room: Room;
  onCheckIn: (room: Room) => void;
  onCancel: (roomId: number) => void;
  isToday: boolean;
}

function ReservationItem({ room, onCheckIn, onCancel, isToday }: ReservationItemProps) {
  if (!room.guest) return null;

  const checkInDate = new Date(room.guest.checkInDate);
  const checkOutDate = new Date(room.guest.checkOutDate);
  const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
  const totalAmount = room.rate * nights;

  return (
    <div className={`py-4 hover:bg-gray-50 transition-colors ${isToday ? 'border-l-4 border-green-500 pl-4' : ''}`}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left: Room & Guest Info */}
        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="font-bold text-lg text-gray-900">Room {room.number}</span>
            <span className="text-xs bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full font-medium">
              {room.type}
            </span>
            {isToday && (
              <span className="text-xs bg-green-600 text-white px-2.5 py-1 rounded-full font-semibold">
                TODAY
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-gray-400" />
              <span className="font-semibold text-gray-900">
                {room.guest.firstName} {room.guest.lastName}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600">{room.guest.phone}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600">{room.guest.email}</span>
            </div>
          </div>
        </div>

        {/* Middle: Dates & Amount */}
        <div className="flex items-center gap-8">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between gap-4">
              <span className="text-gray-600">Check-In:</span>
              <span className="font-semibold text-gray-900">{checkInDate.toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-gray-600">Check-Out:</span>
              <span className="font-semibold text-gray-900">{checkOutDate.toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-gray-600">Duration:</span>
              <span className="font-semibold text-gray-900">{nights} night{nights !== 1 ? 's' : ''}</span>
            </div>
            <div className="flex justify-between gap-4 pt-2 border-t border-gray-200">
              <span className="text-gray-600">Total:</span>
              <span className="font-bold text-blue-600">${totalAmount}</span>
            </div>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex md:flex-col gap-2">
          <button
            onClick={() => onCheckIn(room)}
            className="flex-1 md:flex-none bg-blue-600 text-white py-2.5 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center justify-center gap-2 whitespace-nowrap"
          >
            <DoorOpen className="w-4 h-4" />
            Check-In
          </button>
          <button
            onClick={() => onCancel(room.id)}
            className="flex-1 md:flex-none bg-red-50 text-red-700 py-2.5 px-4 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium flex items-center justify-center gap-2 whitespace-nowrap"
          >
            <X className="w-4 h-4" />
            Cancel
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className="mt-4 border-b border-gray-200" />
    </div>
  );
}
