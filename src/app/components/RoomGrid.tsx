import { Room, RoomStatus } from '../App';
import { DoorOpen, DoorClosed, Calendar, Sparkles, Wrench, Filter, X } from 'lucide-react';
import { useState } from 'react';

interface RoomGridProps {
  rooms: Room[];
  onCheckIn: (room: Room) => void;
  onCheckOut: (room: Room) => void;
  onReserve: (room: Room) => void;
  onStatusChange: (roomId: number, status: RoomStatus) => void;
}

export function RoomGrid({ rooms, onCheckIn, onCheckOut, onReserve, onStatusChange }: RoomGridProps) {
  const [filters, setFilters] = useState({
    roomNumber: '',
    guestName: '',
    status: [] as RoomStatus[],
    roomType: [] as string[],
    priceMin: '',
    priceMax: '',
  });

  const [showFilters, setShowFilters] = useState(true);

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const toggleArrayFilter = (key: 'status' | 'roomType', value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: prev[key].includes(value as never)
        ? prev[key].filter(item => item !== value)
        : [...prev[key], value as never]
    }));
  };

  const clearFilters = () => {
    setFilters({
      roomNumber: '',
      guestName: '',
      status: [],
      roomType: [],
      priceMin: '',
      priceMax: '',
    });
  };

  // Apply filters
  const filteredRooms = rooms.filter(room => {
    // Room number filter
    if (filters.roomNumber && !room.number.toLowerCase().includes(filters.roomNumber.toLowerCase())) {
      return false;
    }

    // Guest name filter
    if (filters.guestName && room.guest) {
      const fullName = `${room.guest.firstName} ${room.guest.lastName}`.toLowerCase();
      if (!fullName.includes(filters.guestName.toLowerCase())) {
        return false;
      }
    } else if (filters.guestName && !room.guest) {
      return false;
    }

    // Status filter
    if (filters.status.length > 0 && !filters.status.includes(room.status)) {
      return false;
    }

    // Room type filter
    if (filters.roomType.length > 0 && !filters.roomType.includes(room.type)) {
      return false;
    }

    // Price range filter
    if (filters.priceMin && room.rate < Number(filters.priceMin)) {
      return false;
    }
    if (filters.priceMax && room.rate > Number(filters.priceMax)) {
      return false;
    }

    return true;
  });

  const activeFilterCount = 
    (filters.roomNumber ? 1 : 0) +
    (filters.guestName ? 1 : 0) +
    filters.status.length +
    filters.roomType.length +
    (filters.priceMin ? 1 : 0) +
    (filters.priceMax ? 1 : 0);

  return (
    <div>
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Room Management</h2>
            <p className="text-sm text-gray-600 mt-1">
              Showing {filteredRooms.length} of {rooms.length} rooms
            </p>
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Filter className="w-4 h-4" />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
            {activeFilterCount > 0 && (
              <span className="bg-white text-blue-600 rounded-full px-2 py-0.5 text-xs font-bold">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        {showFilters && (
          <div className="bg-white rounded-lg shadow p-6 mb-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <Filter className="w-5 h-5 text-blue-600" />
                Filter Rooms
              </h3>
              {activeFilterCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1 text-sm text-red-600 hover:text-red-700"
                >
                  <X className="w-4 h-4" />
                  Clear All Filters
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Room Number Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Room Number
                </label>
                <input
                  type="text"
                  placeholder="e.g., 101"
                  value={filters.roomNumber}
                  onChange={(e) => handleFilterChange('roomNumber', e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Guest Name Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Guest Name
                </label>
                <input
                  type="text"
                  placeholder="Search by guest name"
                  value={filters.guestName}
                  onChange={(e) => handleFilterChange('guestName', e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Price Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price Range
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.priceMin}
                    onChange={(e) => handleFilterChange('priceMin', e.target.value)}
                    className="w-1/2 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.priceMax}
                    onChange={(e) => handleFilterChange('priceMax', e.target.value)}
                    className="w-1/2 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Room Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Room Status
                </label>
                <div className="flex flex-wrap gap-2">
                  {['available', 'occupied', 'reserved', 'cleaning', 'maintenance'].map(status => (
                    <button
                      key={status}
                      onClick={() => toggleArrayFilter('status', status)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                        filters.status.includes(status as RoomStatus)
                          ? status === 'available' ? 'bg-green-600 text-white' :
                            status === 'occupied' ? 'bg-blue-600 text-white' :
                            status === 'reserved' ? 'bg-yellow-600 text-white' :
                            status === 'cleaning' ? 'bg-purple-600 text-white' :
                            'bg-red-600 text-white'
                          : status === 'available' ? 'bg-green-100 text-green-800 hover:bg-green-200' :
                            status === 'occupied' ? 'bg-blue-100 text-blue-800 hover:bg-blue-200' :
                            status === 'reserved' ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' :
                            status === 'cleaning' ? 'bg-purple-100 text-purple-800 hover:bg-purple-200' :
                            'bg-red-100 text-red-800 hover:bg-red-200'
                      }`}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Room Type Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Room Type
                </label>
                <div className="flex flex-wrap gap-2">
                  {['Suite', 'Deluxe', 'Standard'].map(type => (
                    <button
                      key={type}
                      onClick={() => toggleArrayFilter('roomType', type)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                        filters.roomType.includes(type)
                          ? 'bg-indigo-600 text-white'
                          : 'bg-indigo-100 text-indigo-800 hover:bg-indigo-200'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {filteredRooms.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <Filter className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 mb-2">No rooms match your filters</p>
          <button
            onClick={clearFilters}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredRooms.map(room => (
            <RoomCard
              key={room.id}
              room={room}
              onCheckIn={onCheckIn}
              onCheckOut={onCheckOut}
              onReserve={onReserve}
              onStatusChange={onStatusChange}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface RoomCardProps {
  room: Room;
  onCheckIn: (room: Room) => void;
  onCheckOut: (room: Room) => void;
  onReserve: (room: Room) => void;
  onStatusChange: (roomId: number, status: RoomStatus) => void;
}

function RoomCard({ room, onCheckIn, onCheckOut, onReserve, onStatusChange }: RoomCardProps) {
  const statusConfig = {
    available: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-700',
      badge: 'bg-green-100 text-green-800',
      icon: <DoorOpen className="w-5 h-5" />,
      label: 'Available'
    },
    occupied: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-700',
      badge: 'bg-blue-100 text-blue-800',
      icon: <DoorClosed className="w-5 h-5" />,
      label: 'Occupied'
    },
    reserved: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      text: 'text-yellow-700',
      badge: 'bg-yellow-100 text-yellow-800',
      icon: <Calendar className="w-5 h-5" />,
      label: 'Reserved'
    },
    cleaning: {
      bg: 'bg-purple-50',
      border: 'border-purple-200',
      text: 'text-purple-700',
      badge: 'bg-purple-100 text-purple-800',
      icon: <Sparkles className="w-5 h-5" />,
      label: 'Cleaning'
    },
    maintenance: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-700',
      badge: 'bg-red-100 text-red-800',
      icon: <Wrench className="w-5 h-5" />,
      label: 'Maintenance'
    }
  };

  const config = statusConfig[room.status];

  return (
    <div className={`${config.bg} ${config.border} border-2 rounded-lg p-4 transition-all hover:shadow-md`}>
      <div className="flex justify-between items-start mb-3">
        <div>
          <div className="font-bold text-lg text-gray-900">Room {room.number}</div>
          <div className="text-sm text-gray-600">{room.type}</div>
        </div>
        <div className={`${config.badge} px-2 py-1 rounded text-xs font-semibold flex items-center gap-1`}>
          {config.icon}
          {config.label}
        </div>
      </div>

      {room.guest && (
        <div className="mb-3 p-2 bg-white rounded text-sm">
          <div className="font-semibold text-gray-900">
            {room.guest.firstName} {room.guest.lastName}
          </div>
          <div className="text-xs text-gray-600">
            Check-out: {new Date(room.guest.checkOutDate).toLocaleDateString()}
          </div>
        </div>
      )}

      <div className="text-sm text-gray-700 mb-3">
        Rate: ${room.rate}/night
      </div>

      <div className="space-y-2">
        {room.status === 'available' && (
          <>
            <button
              onClick={() => onCheckIn(room)}
              className="w-full bg-blue-600 text-white py-2 px-3 rounded hover:bg-blue-700 transition-colors text-sm"
            >
              Check-In
            </button>
            <button
              onClick={() => onReserve(room)}
              className="w-full bg-yellow-600 text-white py-2 px-3 rounded hover:bg-yellow-700 transition-colors text-sm"
            >
              Reserve
            </button>
          </>
        )}

        {room.status === 'occupied' && (
          <button
            onClick={() => onCheckOut(room)}
            className="w-full bg-red-600 text-white py-2 px-3 rounded hover:bg-red-700 transition-colors text-sm"
          >
            Check-Out
          </button>
        )}

        {room.status === 'reserved' && (
          <button
            onClick={() => onCheckIn(room)}
            className="w-full bg-blue-600 text-white py-2 px-3 rounded hover:bg-blue-700 transition-colors text-sm"
          >
            Check-In
          </button>
        )}

        {room.status === 'cleaning' && (
          <button
            onClick={() => onStatusChange(room.id, 'available')}
            className="w-full bg-green-600 text-white py-2 px-3 rounded hover:bg-green-700 transition-colors text-sm"
          >
            Mark as Clean
          </button>
        )}

        <select
          value={room.status}
          onChange={(e) => onStatusChange(room.id, e.target.value as RoomStatus)}
          className="w-full border border-gray-300 rounded py-2 px-3 text-sm bg-white"
        >
          <option value="available">Available</option>
          <option value="occupied">Occupied</option>
          <option value="reserved">Reserved</option>
          <option value="cleaning">Cleaning</option>
          <option value="maintenance">Maintenance</option>
        </select>
      </div>
    </div>
  );
}