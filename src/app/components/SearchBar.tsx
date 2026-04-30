import { useState, useRef, useEffect } from 'react';
import { Search, X, User, Hotel, Calendar } from 'lucide-react';
import { Room } from '../App';

interface SearchBarProps {
  rooms: Room[];
  onNavigateToRoom: (view: 'rooms' | 'reservations' | 'guests', roomId?: number) => void;
}

export function SearchBar({ rooms, onNavigateToRoom }: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        if (!searchTerm) {
          setIsExpanded(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [searchTerm]);

  const handleExpand = () => {
    setIsExpanded(true);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setIsOpen(value.length > 0);
  };

  const handleClear = () => {
    setSearchTerm('');
    setIsOpen(false);
    setIsExpanded(false);
  };

  const searchLower = searchTerm.toLowerCase();
  
  // Search rooms by number or type
  const roomResults = rooms.filter(room => 
    room.number.toLowerCase().includes(searchLower) ||
    room.type.toLowerCase().includes(searchLower)
  ).slice(0, 5);

  // Search guests
  const guestResults = rooms.filter(room => 
    room.guest && (
      room.guest.firstName.toLowerCase().includes(searchLower) ||
      room.guest.lastName.toLowerCase().includes(searchLower) ||
      room.guest.email.toLowerCase().includes(searchLower) ||
      room.guest.phone.includes(searchTerm)
    )
  ).slice(0, 5);

  // Search reservations
  const reservationResults = rooms.filter(room => 
    room.status === 'reserved' && room.guest && (
      room.guest.firstName.toLowerCase().includes(searchLower) ||
      room.guest.lastName.toLowerCase().includes(searchLower) ||
      room.number.toLowerCase().includes(searchLower)
    )
  ).slice(0, 5);

  const hasResults = roomResults.length > 0 || guestResults.length > 0 || reservationResults.length > 0;

  return (
    <div ref={searchRef} className="relative">
      {!isExpanded ? (
        // Search Icon Button
        <button
          onClick={handleExpand}
          className="p-2 rounded-lg hover:bg-gray-100 transition-all"
          aria-label="Search"
        >
          <Search className="w-5 h-5 text-gray-600" />
        </button>
      ) : (
        // Expanded Search Input
        <div className="relative">
          <div 
            className="relative animate-in fade-in slide-in-from-right-5 duration-200"
            style={{ width: window.innerWidth < 640 ? '240px' : '320px' }}
          >
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search rooms, guests, reservations..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              onFocus={() => searchTerm && setIsOpen(true)}
              className="w-full pl-9 pr-9 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm"
            />
            <button
              onClick={handleClear}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 rounded hover:bg-gray-100 transition-colors"
            >
              <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
            </button>
          </div>

          {isOpen && searchTerm && (
            <div className="absolute top-full right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl max-h-96 overflow-y-auto z-50 animate-in fade-in slide-in-from-top-2 duration-200" style={{ width: window.innerWidth < 640 ? '280px' : '400px' }}>
              {!hasResults ? (
                <div className="p-4 text-center text-gray-500 text-sm">
                  No results found for "{searchTerm}"
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {roomResults.length > 0 && (
                    <div className="p-2">
                      <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase">
                        Rooms
                      </div>
                      {roomResults.map(room => (
                        <button
                          key={room.id}
                          onClick={() => {
                            onNavigateToRoom('rooms', room.id);
                            handleClear();
                          }}
                          className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded transition-colors text-left"
                        >
                          <div className={`w-10 h-10 rounded flex items-center justify-center ${
                            room.status === 'available' ? 'bg-green-100' :
                            room.status === 'occupied' ? 'bg-blue-100' :
                            room.status === 'reserved' ? 'bg-yellow-100' :
                            room.status === 'cleaning' ? 'bg-purple-100' : 'bg-red-100'
                          }`}>
                            <Hotel className={`w-5 h-5 ${
                              room.status === 'available' ? 'text-green-700' :
                              room.status === 'occupied' ? 'text-blue-700' :
                              room.status === 'reserved' ? 'text-yellow-700' :
                              room.status === 'cleaning' ? 'text-purple-700' : 'text-red-700'
                            }`} />
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold text-gray-900 text-sm">Room {room.number}</div>
                            <div className="text-xs text-gray-600">{room.type} - {room.status}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                  {guestResults.length > 0 && (
                    <div className="p-2">
                      <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase">
                        Guests
                      </div>
                      {guestResults.map(room => room.guest && (
                        <button
                          key={room.id}
                          onClick={() => {
                            onNavigateToRoom('guests', room.id);
                            handleClear();
                          }}
                          className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded transition-colors text-left"
                        >
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                            {room.guest.firstName.charAt(0)}{room.guest.lastName.charAt(0)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-gray-900 text-sm truncate">
                              {room.guest.firstName} {room.guest.lastName}
                            </div>
                            <div className="text-xs text-gray-600 truncate">
                              Room {room.number} - {room.guest.email}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                  {reservationResults.length > 0 && (
                    <div className="p-2">
                      <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase">
                        Reservations
                      </div>
                      {reservationResults.map(room => room.guest && (
                        <button
                          key={room.id}
                          onClick={() => {
                            onNavigateToRoom('reservations', room.id);
                            handleClear();
                          }}
                          className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded transition-colors text-left"
                        >
                          <div className="w-10 h-10 bg-yellow-100 rounded flex items-center justify-center">
                            <Calendar className="w-5 h-5 text-yellow-700" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-gray-900 text-sm truncate">
                              {room.guest.firstName} {room.guest.lastName} - Room {room.number}
                            </div>
                            <div className="text-xs text-gray-600">
                              Check-in: {new Date(room.guest.checkInDate).toLocaleDateString()}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}