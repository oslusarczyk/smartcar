import type { PaymentStatus } from '../utils/types'; // upewnij się, że masz ten typ gdzieś

interface PaymentModalProps {
  open: boolean;
  onClose: () => void;
  onAction: (status: PaymentStatus) => void;
  isLoading: boolean;
  reservation: {
    car: {
      brand: { brand_name: string };
      model: string;
    };
    reservation_price: number;
  } | null;
}

export default function PaymentModal({
  open,
  onAction,
  isLoading,
  reservation,
}: PaymentModalProps) {
  if (!open || !reservation) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
        <h2 className="mb-4 text-xl font-semibold text-gray-800">
          Potwierdzenie płatności
        </h2>
        <p className="mb-6">
          Czy na pewno chcesz opłacić rezerwację{' '}
          <strong>
            {reservation.car.brand.brand_name} {reservation.car.model}
          </strong>{' '}
          za {reservation.reservation_price} PLN?
        </p>
        <div className="flex justify-end gap-4">
          <button
            onClick={() => onAction('cancelled')}
            disabled={isLoading}
            className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600 disabled:opacity-50"
          >
            {isLoading ? 'Przetwarzanie...' : 'Anuluj płatność'}
          </button>
          <button
            onClick={() => onAction('paid')}
            disabled={isLoading}
            className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700 disabled:opacity-50"
          >
            {isLoading ? 'Przetwarzanie...' : 'Zapłać'}
          </button>
        </div>
      </div>
    </div>
  );
}
