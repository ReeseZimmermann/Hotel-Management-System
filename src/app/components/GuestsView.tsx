import { Room } from '../App';
import { User, Phone, Mail, Calendar, Hotel, Search } from 'lucide-react';
import { useState } from 'react';

interface GuestsViewProps {
  rooms: Room[];
}

export function GuestsView({ rooms }: GuestsViewProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const currentGuests = rooms.filter(room => 
    (room.status === 'occupied' || room.status === 'reserved') && room.guest
  );

  const filteredGuests = currentGuests.filter(room => {
    if (!room.guest) return false;
    const searchLower = searchTerm.toLowerCase();
    return (
      room.guest.firstName.toLowerCase().includes(searchLower) ||
      room.guest.lastName.toLowerCase().includes(searchLower) ||
      room.guest.email.toLowerCase().includes(searchLower) ||
      room.guest.phone.includes(searchTerm) ||
      room.number.includes(searchTerm)
    );
  });

  const occupiedGuests = filteredGuests.filter(room => room.status === 'occupied');
  const reservedGuests = filteredGuests.filter(room => room.status === 'reserved');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Guest Directory</h2>
          <p className="text-sm text-gray-600 mt-1">View and manage all current and upcoming guests</p>
        </div>
        <div className="flex gap-3">
          <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg">
            <span className="font-semibold">{occupiedGuests.length}</span> Checked-In
          </div>
          <div className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-lg">
            <span className="font-semibold">{reservedGuests.length}</span> Reserved
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, email, phone, or room number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {occupiedGuests.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-blue-600" />
            Currently Checked-In ({occupiedGuests.length})
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {occupiedGuests.map(room => (
              <GuestCard key={room.id} room={room} status="Checked-In" />
            ))}
          </div>
        </div>
      )}

      {reservedGuests.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-yellow-600" />
            Upcoming Reservations ({reservedGuests.length})
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {reservedGuests.map(room => (
              <GuestCard key={room.id} room={room} status="Reserved" />
            ))}
          </div>
        </div>
      )}

      {filteredGuests.length === 0 && (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">
            {searchTerm ? 'No guests found matching your search' : 'No guests currently registered'}
          </p>
        </div>
      )}
    </div>
  );
}

interface GuestCardProps {
  room: Room;
  status: 'Checked-In' | 'Reserved';
}

function GuestCard({ room, status }: GuestCardProps) {
  if (!room.guest) return null;

  const checkInDate = new Date(room.guest.checkInDate);
  const checkOutDate = new Date(room.guest.checkOutDate);
  const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
            {room.guest.firstName.charAt(0)}{room.guest.lastName.charAt(0)}
          </div>
          <div>
            <div className="font-semibold text-gray-900">
              {room.guest.firstName} {room.guest.lastName}
            </div>
            <div className="flex items-center gap-2 mt-1">
              <Hotel className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">Room {room.number} - {room.type}</span>
            </div>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
          status === 'Checked-In' 
            ? 'bg-blue-100 text-blue-800' 
            : 'bg-yellow-100 text-yellow-800'
        }`}>
          {status}
        </span>
      </div>

      <div className="space-y-2 mb-3">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Phone className="w-4 h-4" />
          <span>{room.guest.phone}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Mail className="w-4 h-4" />
          <span>{room.guest.email}</span>
        </div>
      </div>

      <div className="pt-3 border-t border-gray-200 grid grid-cols-3 gap-2 text-center text-sm">
        <div>
          <div className="text-gray-600 text-xs">Check-In</div>
          <div className="font-semibold text-gray-900">{checkInDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
        </div>
        <div>
          <div className="text-gray-600 text-xs">Check-Out</div>
          <div className="font-semibold text-gray-900">{checkOutDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
        </div>
        <div>
          <div className="text-gray-600 text-xs">Nights</div>
          <div className="font-semibold text-gray-900">{nights}</div>
        </div>
      </div>
    </div>
  );
}
