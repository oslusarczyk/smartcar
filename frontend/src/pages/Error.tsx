import { useNavigate } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';

export default function Error({ message }: { message?: string }) {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center p-6 text-center">
      <AlertTriangle className="mb-4 h-12 w-12 text-red-600" />
      <h2 className="mb-2 text-2xl font-bold">Wystąpił błąd</h2>
      <p className="mb-6 text-gray-700">
        {message || 'Coś poszło nie tak. Spróbuj ponownie później.'}
      </p>
      <button
        onClick={() => navigate(-1)}
        className="rounded bg-green-600 px-5 py-2 text-white transition hover:bg-green-700"
      >
        Wróć
      </button>
    </div>
  );
}
