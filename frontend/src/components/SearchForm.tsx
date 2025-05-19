import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import type { FilterParams } from '../utils/types';
import { useUtils } from '../contexts/UtilsContext';

interface Props {
  onFilterChange: (filters: FilterParams) => void;
}

export default function SearchForm({ onFilterChange }: Props) {
  const { brands, locations } = useUtils();
  const [searchParams] = useSearchParams();

  const { register, watch, setValue, getValues } = useForm<FilterParams>({
    defaultValues: {
      location: '',
      brand: '',
      seats: '',
      price_min: '',
      price_max: '',
    },
  });

  const watchedValues = watch();

  useEffect(() => {
    const locationParam = searchParams.get('location');
    if (locationParam) {
      setValue('location', locationParam);
      onFilterChange({ ...getValues(), location: locationParam });
    }
  }, [searchParams, setValue]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      onFilterChange(watchedValues);
    }, 10);

    return () => clearTimeout(timeout);
  }, [watchedValues, onFilterChange]);

  return (
    <form className="mx-auto mb-8 grid max-w-3xl grid-cols-1 gap-4 md:grid-cols-2">
      <div>
        <label className="mb-1 block font-semibold">Miejsce wynajmu:</label>
        <select
          {...register('location')}
          className="w-full rounded border px-3 py-2"
        >
          <option value="">Wszystkie</option>
          {locations.map(({ location_id, location_name }) => (
            <option key={location_id} value={location_name}>
              {location_name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1 block font-semibold">Marka:</label>
        <select
          {...register('brand')}
          className="w-full rounded border px-3 py-2"
        >
          <option value="">Wszystkie</option>
          {brands.map(({ brand_id, brand_name }) => (
            <option key={brand_id} value={brand_name}>
              {brand_name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1 block font-semibold">Liczba miejsc:</label>
        <select
          {...register('seats')}
          className="w-full rounded border px-3 py-2"
        >
          <option value="">Dowolna</option>
          <option value="4">4 miejsca</option>
          <option value="5">5 miejsc</option>
          <option value="7">7 miejsc</option>
        </select>
      </div>

      <div className="flex gap-4">
        <div className="flex-1">
          <label className="mb-1 block font-semibold">Cena min:</label>
          <input
            type="number"
            {...register('price_min')}
            className="w-full rounded border px-3 py-2"
            min={0}
          />
        </div>
        <div className="flex-1">
          <label className="mb-1 block font-semibold">Cena max:</label>
          <input
            type="number"
            {...register('price_max')}
            className="w-full rounded border px-3 py-2"
            min={0}
          />
        </div>
      </div>
    </form>
  );
}
