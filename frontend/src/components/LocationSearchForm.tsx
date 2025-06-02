import { useRef } from 'react';
import type { Location } from '../utils/types';
import LabelField from './Label';

interface LocationSearchFormProps {
  locations: Location[];
  onSearch: (selectedLocation: string) => void;
}

export default function LocationSearchForm({
  locations,
  onSearch,
}: LocationSearchFormProps) {
  const locationsRef = useRef<HTMLSelectElement>(null);

  const handleClick = () => {
    const selectedLocation = locationsRef.current?.value;
    if (selectedLocation) {
      onSearch(selectedLocation);
    }
  };

  return (
    <div className="mx-auto max-w-sm rounded-xl bg-white p-6 shadow-md">
      <LabelField label="MIEJSCE WYNAJMU" id="location-select">
        <select
          id="location-select"
          className="mb-4 w-full rounded border px-3 py-2"
          ref={locationsRef}
        >
          {locations.map(({ location_id: id, location_name: name }) => {
            return (
              <option key={id} value={name}>
                {name}
              </option>
            );
          })}
        </select>
      </LabelField>

      <button
        className="w-full rounded bg-green-600 py-2 text-white hover:bg-green-700"
        onClick={handleClick}
      >
        SZUKAJ
      </button>
    </div>
  );
}
