import { useNavigate } from 'react-router-dom';

interface LoginPromptModalProps {
  onClose: () => void;
}

export default function LoginPromptModal({ onClose }: LoginPromptModalProps) {
  const navigate = useNavigate();

  const handleGoToLogin = () => {
    onClose(); // Zamknij modal przed nawigacją
    navigate('/auth');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-[90%] max-w-md rounded-lg bg-white p-6 shadow-lg">
        <h2 className="mb-4 text-xl font-semibold">Zaloguj się</h2>
        <p className="mb-6">
          Musisz być zalogowany, aby zarezerwować samochód.
        </p>
        <button
          onClick={handleGoToLogin}
          className="w-full rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
        >
          Przejdź do logowania
        </button>
        <button
          onClick={onClose}
          className="mt-4 w-full rounded border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-100"
        >
          Anuluj
        </button>
      </div>
    </div>
  );
}
