import { useUtils } from '../contexts/UtilsContext';
import CarPhoto from '../assets/car_logo.jpg';

export default function MainPage() {
  const { locations } = useUtils();

  return (
    <div className="p-6">
      <h1 className="mb-6 text-center text-3xl font-bold">WYNAJMIJ AUTO</h1>
      <div className="mx-auto max-w-sm rounded-xl bg-white p-6 shadow-md">
        <label className="mb-2 block font-medium">MIEJSCE WYNAJMU</label>
        <select className="mb-4 w-full rounded border px-3 py-2">
          {locations.map(({ location_id: id, location_name: name }) => {
            return (
              <option key={id} value={name}>
                {name}
              </option>
            );
          })}
        </select>
        <button className="w-full rounded bg-green-600 py-2 text-white hover:bg-green-700">
          SZUKAJ
        </button>
      </div>

      <h2 className="mt-12 mb-6 text-center text-2xl font-bold">
        NAJPOPULARNIEJSZE SAMOCHODY
      </h2>

      <div className="grid grid-cols-1 justify-items-center gap-8 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((_, i) => (
          <div
            key={i}
            className="flex w-90 flex-col rounded-lg border bg-white shadow-md md:w-full"
          >
            <img
              src={CarPhoto}
              alt="Samochód"
              className="h-50 w-full rounded-t-lg object-cover md:w-90"
            />
            <div className="flex flex-col gap-1 p-4 text-lg">
              <h3 className="text-center text-2xl font-bold uppercase">
                Opel Astra
              </h3>
              <div className="flex items-center gap-1">
                <span className="text-lg">📍</span>4 lokalizacje
              </div>
              <div className="flex items-center gap-1">
                <span className="text-lg">👤</span>5 osób
              </div>
              <div className="font-semibold">od 100 PLN</div>
              <button className="mt-2 rounded-lg bg-green-600 px-3 py-2 text-[1.3rem] text-white transition hover:bg-green-700">
                ZOBACZ WIĘCEJ
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
