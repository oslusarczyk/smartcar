import { Calendar, Car } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AdminContainer() {
  const navigate = useNavigate();

  return (
    <div className="mx-auto max-w-4xl space-y-6 rounded-lg bg-white p-10 shadow-md">
      <h1 className="text-center text-2xl font-bold text-gray-800">
        Panel Admina
      </h1>
      <div className="flex gap-6">
        <button
          onClick={() => navigate('/admin/reservation')}
          className="flex flex-1 flex-col items-center justify-center gap-3 rounded bg-green-600 py-6 text-xl font-semibold text-white transition hover:bg-green-700"
        >
          <Calendar className="h-8 w-8" />
          Rezerwacje
        </button>
        <button
          onClick={() => navigate('/admin/add')}
          className="flex flex-1 flex-col items-center justify-center gap-3 rounded bg-blue-600 py-6 text-xl font-semibold text-white transition hover:bg-blue-700"
        >
          <Car className="h-8 w-8" />
          Dodaj samochód
        </button>
      </div>
    </div>
  );
}
