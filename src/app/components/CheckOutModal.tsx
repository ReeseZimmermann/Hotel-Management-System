import { Room } from '../App';
import { X } from 'lucide-react';

interface CheckOutModalProps {
  room: Room;
  onClose: () => void;
  onCheckOut: (roomId: number) => void;
}

export function CheckOutModal({ room, onClose, onCheckOut }: CheckOutModalProps) {
  const handleCheckOut = () => {
    onCheckOut(room.id);
  };

  if (!room.guest) return null;

  const checkInDate = new Date(room.guest.checkInDate);
  const checkOutDate = new Date(room.guest.checkOutDate);
  const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
  const totalAmount = room.rate * nights;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Check-Out - Room {room.number}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="font-semibold text-gray-900 mb-2">Guest Information</div>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Name:</span>
                <span className="font-medium">{room.guest.firstName} {room.guest.lastName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Phone:</span>
                <span className="font-medium">{room.guest.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Email:</span>
                <span className="font-medium">{room.guest.email}</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="font-semibold text-gray-900 mb-3">Stay Summary</div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Check-In:</span>
                <span className="font-medium">{checkInDate.toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Check-Out:</span>
                <span className="font-medium">{checkOutDate.toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Number of Nights:</span>
                <span className="font-medium">{nights}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Room Type:</span>
                <span className="font-medium">{room.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Rate per Night:</span>
                <span className="font-medium">${room.rate}</span>
              </div>
              
              <div className="border-t border-gray-300 pt-2 mt-2">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-900">Total Amount:</span>
                  <span className="font-bold text-xl text-blue-600">${totalAmount}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="text-sm text-yellow-800">
              <div className="font-semibold mb-1">Note:</div>
              After checkout, the room status will be set to "Cleaning" automatically.
            </div>
          </div>
        </div>

        <div className="flex gap-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleCheckOut}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Complete Check-Out
          </button>
        </div>
      </div>
    </div>
  );
}
