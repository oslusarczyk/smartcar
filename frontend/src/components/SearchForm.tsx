import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import type { FilterParams } from '../utils/types';
import { useUtils } from '../contexts/UtilsContext';
import LabelField from '../components/Label';

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
  }, [searchParams, setValue, getValues, onFilterChange]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      onFilterChange(watchedValues);
    }, 300);

    return () => clearTimeout(timeout);
  }, [watchedValues, onFilterChange]);

  const inputAndSelectClassNames = 'w-full rounded border px-3 py-2';

  return (
    <form className="mx-auto mb-8 grid max-w-3xl grid-cols-1 gap-4 md:grid-cols-2">
      <LabelField label="Miejsce wynajmu:" id="location">
        <select {...register('location')} className={inputAndSelectClassNames}>
          <option value="">Wszystkie</option>
          {locations.map(({ location_id, location_name }) => (
            <option key={location_id} value={location_name}>
              {location_name}
            </option>
          ))}
        </select>
      </LabelField>

      <LabelField label="Marka:" id="brand">
        <select {...register('brand')} className={inputAndSelectClassNames}>
          <option value="">Wszystkie</option>
          {brands.map(({ brand_id, brand_name }) => (
            <option key={brand_id} value={brand_name}>
              {brand_name}
            </option>
          ))}
        </select>
      </LabelField>

      <LabelField label="Liczba miejsc:" id="seats">
        <select {...register('seats')} className={inputAndSelectClassNames}>
          <option value="">Dowolna</option>
          <option value="4">4 miejsca</option>
          <option value="5">5 miejsc</option>
          <option value="7">7 miejsc</option>
        </select>
      </LabelField>

      <div className="flex gap-4">
        <LabelField label="Cena min:" id="price_min">
          <input
            type="number"
            {...register('price_min')}
            className={inputAndSelectClassNames}
            min={0}
          />
        </LabelField>
        <LabelField label="Cena max:" id="price_max">
          <input
            type="number"
            {...register('price_max')}
            className={inputAndSelectClassNames}
            min={0}
          />
        </LabelField>
      </div>
    </form>
  );
}
