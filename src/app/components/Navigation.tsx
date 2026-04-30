import { LayoutDashboard, Hotel, Calendar, Users, CreditCard, FileText } from 'lucide-react';

type ViewType = 'dashboard' | 'rooms' | 'reservations' | 'guests' | 'payments' | 'reports';

interface NavigationProps {
  currentView: ViewType;
  onNavigate: (view: ViewType) => void;
}

export function Navigation({ currentView, onNavigate }: NavigationProps) {
  const navItems = [
    { id: 'dashboard' as ViewType, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'rooms' as ViewType, label: 'Room Management', icon: Hotel },
    { id: 'reservations' as ViewType, label: 'Reservations', icon: Calendar },
    { id: 'guests' as ViewType, label: 'Guests', icon: Users },
    { id: 'payments' as ViewType, label: 'Payments', icon: CreditCard },
    { id: 'reports' as ViewType, label: 'Reports', icon: FileText },
  ];

  return (
    <nav className="flex gap-2 overflow-x-auto pb-2">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = currentView === item.id;
        
        return (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
              isActive
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Icon className="w-4 h-4" />
            <span className="font-medium">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
