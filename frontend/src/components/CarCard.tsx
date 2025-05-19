import React from 'react';
import { getLocationText, getSeatsText } from '../utils/functions';
import type { Car } from '../utils/types';
import carImage from '../assets/car.jpg';

const CarCard: React.FC<{ car: Car }> = ({ car }) => {
  const carName = `${car.brand} ${car.model}`;
  return (
    <div
      key={car.car_id}
      className="mb-2 flex w-90 flex-col rounded-lg border bg-white shadow-md md:w-80 xl:w-100"
    >
      <img src={carImage} alt={carName} />

      <div className="flex flex-col gap-1 p-4 text-lg md:gap-2">
        <h3 className="text-center text-2xl font-bold uppercase">{carName}</h3>
        <div className="flex items-center gap-1">
          <span className="text-lg">📍</span>
          {car.location?.length ?? 0}{' '}
          {getLocationText(car.location?.length ?? 0)}
        </div>
        <div className="flex items-center gap-1">
          <span className="text-lg">👤</span>
          {car.seats_available} {getSeatsText(car.seats_available)}
        </div>
        <div className="font-semibold">od {car.price_per_day} PLN</div>
        <button className="mt-2 rounded-lg bg-green-600 px-3 py-2 text-[1.3rem] text-white transition hover:bg-green-700">
          ZOBACZ WIĘCEJ
        </button>
      </div>
    </div>
  );
};

export default CarCard;
