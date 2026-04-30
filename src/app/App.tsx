import { useState, useEffect } from 'react';
import { Dashboard } from './components/Dashboard';
import { RoomGrid } from './components/RoomGrid';
import { CheckInModal } from './components/CheckInModal';
import { CheckOutModal } from './components/CheckOutModal';
import { ReservationModal } from './components/ReservationModal';
import { ReservationsView } from './components/ReservationsView';
import { GuestsView } from './components/GuestsView';
import { PaymentsView } from './components/PaymentsView';
import { ReportsView } from './components/ReportsView';
import { StatusBar } from './components/StatusBar';
import { SearchBar } from './components/SearchBar';
import { LoginPage } from './components/LoginPage';
import { LayoutDashboard, Hotel, Calendar, Users, CreditCard, FileText, Menu, X } from 'lucide-react';

export type RoomStatus = 'available' | 'occupied' | 'reserved' | 'cleaning' | 'maintenance';

export interface Guest {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  checkInDate: string;
  checkOutDate: string;
}

export interface Room {
  id: number;
  number: string;
  type: string;
  status: RoomStatus;
  guest?: Guest;
  rate: number;
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [rooms, setRooms] = useState<Room[]>(
    Array.from({ length: 20 }, (_, i) => ({
      id: i + 1,
      number: `${100 + i}`,
      type: i % 3 === 0 ? 'Suite' : i % 3 === 1 ? 'Deluxe' : 'Standard',
      status: i < 5 ? 'available' : i < 12 ? 'occupied' : i < 15 ? 'reserved' : i < 18 ? 'cleaning' : 'available',
      rate: i % 3 === 0 ? 150 : i % 3 === 1 ? 120 : 90,
      guest: i >= 5 && i < 12 ? {
        firstName: 'Guest',
        lastName: `${i}`,
        phone: '555-0100',
        email: `guest${i}@email.com`,
        checkInDate: new Date().toISOString().split('T')[0],
        checkOutDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      } : undefined
    }))
  );

  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [activeModal, setActiveModal] = useState<'checkin' | 'checkout' | 'reservation' | null>(null);
  const [currentView, setCurrentView] = useState<'dashboard' | 'rooms' | 'reservations' | 'guests' | 'payments' | 'reports'>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isStatusBarVisible, setIsStatusBarVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleCheckIn = (roomId: number, guest: Guest) => {
    setRooms(rooms.map(room => 
      room.id === roomId 
        ? { ...room, status: 'occupied', guest }
        : room
    ));
    setActiveModal(null);
    setSelectedRoom(null);
  };

  const handleCheckOut = (roomId: number) => {
    setRooms(rooms.map(room => 
      room.id === roomId 
        ? { ...room, status: 'cleaning', guest: undefined }
        : room
    ));
    setActiveModal(null);
    setSelectedRoom(null);
  };

  const handleReservation = (roomId: number, guest: Guest) => {
    setRooms(rooms.map(room => 
      room.id === roomId 
        ? { ...room, status: 'reserved', guest }
        : room
    ));
    setActiveModal(null);
    setSelectedRoom(null);
  };

  const handleStatusChange = (roomId: number, status: RoomStatus) => {
    setRooms(rooms.map(room => 
      room.id === roomId 
        ? { ...room, status, ...(status === 'available' ? { guest: undefined } : {}) }
        : room
    ));
  };

  const handleNavigateToRoom = (view: 'rooms' | 'reservations' | 'guests', roomId?: number) => {
    setCurrentView(view);
    setIsMobileMenuOpen(false);
    // Optionally scroll to room or highlight it
  };

  const navItems = [
    { id: 'dashboard' as const, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'rooms' as const, label: 'Room Management', icon: Hotel },
    { id: 'reservations' as const, label: 'Reservations', icon: Calendar },
    { id: 'guests' as const, label: 'Guests', icon: Users },
    { id: 'payments' as const, label: 'Payments', icon: CreditCard },
    { id: 'reports' as const, label: 'Reports', icon: FileText },
  ];

  const toggleStatusBar = () => {
    setIsStatusBarVisible(!isStatusBarVisible);
  };

  const handleLogin = (email: string, password: string) => {
    // Simple demo login - accepts any credentials
    setIsAuthenticated(true);
  };

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Modern Top Navigation Bar */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Left: Logo + Navigation */}
            <div className="flex items-center gap-8">
              {/* Logo/Brand with Hover Trigger */}
              <div 
                className="flex items-center gap-3 relative"
                onMouseEnter={() => !isMobile && setIsStatusBarVisible(true)}
                onMouseLeave={() => !isMobile && setIsStatusBarVisible(false)}
              >
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  {isMobileMenuOpen ? (
                    <X className="w-5 h-5 text-gray-700" />
                  ) : (
                    <Menu className="w-5 h-5 text-gray-700" />
                  )}
                </button>
                
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold text-gray-900 tracking-tight">HMS</h1>
                  
                  {/* Toggle Button for Mobile/Accessibility */}
                  <button
                    onClick={toggleStatusBar}
                    className="lg:hidden p-1.5 rounded hover:bg-gray-100 transition-colors"
                    aria-label="Toggle status bar"
                    aria-expanded={isStatusBarVisible}
                  >
                    <svg 
                      className={`w-4 h-4 text-gray-600 transition-transform duration-200 ${isStatusBarVisible ? 'rotate-180' : ''}`}
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {/* Desktop Accessibility Toggle (subtle) */}
                  <button
                    onClick={toggleStatusBar}
                    className="hidden lg:block p-1.5 rounded hover:bg-gray-100 transition-colors opacity-60 hover:opacity-100"
                    aria-label="Toggle status bar"
                    aria-expanded={isStatusBarVisible}
                  >
                    <svg 
                      className={`w-3.5 h-3.5 text-gray-500 transition-transform duration-200 ${isStatusBarVisible ? 'rotate-180' : ''}`}
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Desktop Navigation */}
              <nav className="hidden lg:flex items-center gap-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentView === item.id;
                  
                  return (
                    <button
                      key={item.id}
                      onClick={() => setCurrentView(item.id)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                        isActive
                          ? 'bg-gray-100 text-gray-900'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Right: Search */}
            <div className="flex items-center">
              <SearchBar rooms={rooms} onNavigateToRoom={handleNavigateToRoom} />
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          {isMobileMenuOpen && (
            <div className="lg:hidden border-t border-gray-200 py-4">
              <nav className="flex flex-col gap-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentView === item.id;
                  
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setCurrentView(item.id);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-all ${
                        isActive
                          ? 'bg-gray-100 text-gray-900'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          )}
        </div>

        {/* Status Bar - Below Navigation with Animation */}
        <div 
          className={`border-t border-gray-100 overflow-hidden transition-all duration-300 ease-in-out ${
            isStatusBarVisible ? 'max-h-24 opacity-100' : 'max-h-0 opacity-0'
          }`}
          style={{
            transform: isStatusBarVisible ? 'translateY(0)' : 'translateY(-10px)',
            transition: 'all 0.3s ease-in-out'
          }}
        >
          <div className="max-w-7xl mx-auto px-4 py-3">
            <StatusBar rooms={rooms} />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {currentView === 'dashboard' && (
          <Dashboard 
            rooms={rooms}
            onNavigateToRooms={() => setCurrentView('rooms')}
            onNavigateToReservations={() => setCurrentView('reservations')}
          />
        )}
        
        {currentView === 'rooms' && (
          <RoomGrid
            rooms={rooms}
            onCheckIn={(room) => {
              setSelectedRoom(room);
              setActiveModal('checkin');
            }}
            onCheckOut={(room) => {
              setSelectedRoom(room);
              setActiveModal('checkout');
            }}
            onReserve={(room) => {
              setSelectedRoom(room);
              setActiveModal('reservation');
            }}
            onStatusChange={handleStatusChange}
          />
        )}
        
        {currentView === 'reservations' && (
          <ReservationsView 
            rooms={rooms}
            onCheckIn={(room) => {
              setSelectedRoom(room);
              setActiveModal('checkin');
            }}
            onCancelReservation={(roomId) => {
              setRooms(rooms.map(room => 
                room.id === roomId 
                  ? { ...room, status: 'available', guest: undefined }
                  : room
              ));
            }}
          />
        )}
        
        {currentView === 'guests' && (
          <GuestsView rooms={rooms} />
        )}
        
        {currentView === 'payments' && (
          <PaymentsView rooms={rooms} />
        )}
        
        {currentView === 'reports' && (
          <ReportsView rooms={rooms} />
        )}
      </main>

      {activeModal === 'checkin' && selectedRoom && (
        <CheckInModal
          room={selectedRoom}
          onClose={() => {
            setActiveModal(null);
            setSelectedRoom(null);
          }}
          onCheckIn={handleCheckIn}
        />
      )}

      {activeModal === 'checkout' && selectedRoom && (
        <CheckOutModal
          room={selectedRoom}
          onClose={() => {
            setActiveModal(null);
            setSelectedRoom(null);
          }}
          onCheckOut={handleCheckOut}
        />
      )}

      {activeModal === 'reservation' && selectedRoom && (
        <ReservationModal
          room={selectedRoom}
          onClose={() => {
            setActiveModal(null);
            setSelectedRoom(null);
          }}
          onReserve={handleReservation}
        />
      )}
    </div>
  );
}