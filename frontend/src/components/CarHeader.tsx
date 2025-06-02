import { Calendar, MapPin, UserRound } from 'lucide-react';
import { getSeatsText } from '../utils/functions';
import type { CarDetailsProps, Location } from '../utils/types';

interface CarHeaderInfoProps {
  car: CarDetailsProps;
  locations?: Location[];
  imagePath: string; // Base path for images
}

export default function CarHeaderInfo({
  car,
  locations,
  imagePath,
}: CarHeaderInfoProps) {
  const carName = `${car.brand} ${car.model}`;

  return (
    <div className="flex flex-col gap-6 lg:flex-row">
      <div className="flex-1">
        <img
          src={`${imagePath}/${car.photo}`}
          alt={carName}
          className="w-full rounded-xl shadow-md"
        />
      </div>

      <div className="bg-alpha-50 flex flex-1 flex-col gap-2 rounded-xl p-6 text-2xl shadow-md">
        <h2 className="text-2xl font-bold">{carName}</h2>

        <div className="flex items-center gap-1">
          <span className="text-lg">
            <MapPin />
          </span>
          {locations?.length
            ? locations.map((location) => location.location_name).join(', ') +
              ' '
            : null}
        </div>
        <div className="flex items-center gap-1">
          <span className="text-lg">
            <UserRound />
          </span>
          {car.seats_available} {getSeatsText(car.seats_available)}
        </div>
        <div className="flex items-center gap-1">
          <span className="text-lg">
            <Calendar />
          </span>
          {car.production_year}
        </div>
        <div className="text-4xl font-bold uppercase">
          od {car.price_per_day} PLN
        </div>
      </div>
    </div>
  );
}
