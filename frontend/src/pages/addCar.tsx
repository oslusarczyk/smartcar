import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useUtils } from '../contexts/UtilsContext';
import toast from 'react-hot-toast';
import { addCar } from '../api/carsApi';
import LabelField from '../components/Label';

export default function CarAdmin() {
  const queryClient = useQueryClient();
  const { brands, locations } = useUtils();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const mutation = useMutation({
    mutationFn: (formData: FormData) => addCar(formData),
    onSuccess: () => {
      toast.success('Samochód został dodany.');
      reset();
      queryClient.invalidateQueries({ queryKey: ['cars'] });
    },
    onError: (err: any) => {
      toast.error(err.response.data.message);
    },
  });

  const onSubmit = (data: any) => {
    const formData = new FormData();
    formData.append('car_photo', data.carPhoto[0]);
    formData.append('brand_id', data.brand);
    formData.append('model', data.model);
    formData.append('price_per_day', data.price);
    formData.append('seats_available', data.seats);
    formData.append('production_year', data.productionYear);
    formData.append('car_description', data.description);
    formData.append('locations', JSON.stringify(data.locations));
    mutation.mutate(formData);
  };

  const inputClassNames =
    'w-full rounded border border-gray-300 bg-white p-2 text-gray-700 transition focus:border-green-500 focus:ring-2 focus:ring-green-300 focus:outline-none';
  const selectClassNames =
    'w-full rounded border border-gray-300 bg-white p-2 text-gray-700 transition focus:border-green-500 focus:ring-2 focus:ring-green-300 focus:outline-none';
  const textAreaClassNames =
    'w-full resize-none rounded border border-gray-300 bg-white p-2 text-gray-700 transition focus:border-green-500 focus:ring-2 focus:ring-green-300 focus:outline-none';

  return (
    <div className="mx-auto max-w-3xl p-6">
      <h2 className="mb-6 text-3xl font-bold text-gray-800">Dodaj auto</h2>
      <form
        className="space-y-6 rounded-xl bg-white p-8 shadow-md"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div>
          <label
            htmlFor="carPhoto"
            className="inline-block cursor-pointer rounded-lg border bg-green-500 px-4 py-2 text-white hover:bg-green-600"
          >
            Wybierz zdjęcie
          </label>
          <input
            id="carPhoto"
            type="file"
            accept="image/png, image/jpeg"
            {...register('carPhoto', { required: 'Zdjęcie jest wymagane.' })}
            className="hidden"
          />
          {errors.carPhoto?.message && (
            <p className="text-red-500">{String(errors.carPhoto.message)}</p>
          )}
        </div>

        <LabelField label="Marka" id="brand" errors={errors.brand as any}>
          <select
            {...register('brand', { required: 'Wybierz markę.' })}
            className={selectClassNames}
          >
            <option value="">-- Wybierz markę --</option>
            {brands.map(({ brand_id, brand_name }) => (
              <option key={brand_id} value={brand_id}>
                {brand_name}
              </option>
            ))}
          </select>
        </LabelField>

        <LabelField label="Model" id="model" errors={errors.model as any}>
          <input
            type="text"
            {...register('model', { required: 'Model jest wymagany.' })}
            className={inputClassNames}
          />
        </LabelField>

        <LabelField label="Cena" id="price" errors={errors.price as any}>
          <input
            type="number"
            {...register('price', {
              required: 'Cena jest wymagana.',
              min: { value: 0, message: 'Minimalna wartość to 0' },
              max: { value: 1000, message: 'Maksymalna wartość to 1000' },
            })}
            className={inputClassNames}
          />
        </LabelField>

        <LabelField
          label="Rok produkcji"
          id="productionYear"
          errors={errors.productionYear as any}
        >
          <input
            type="number"
            {...register('productionYear', {
              required: 'Rok jest wymagany.',
              min: { value: 2000, message: 'Minimalna wartość to 2000' },
              max: { value: 2025, message: 'Maksymalna wartość to 2025' },
            })}
            className={inputClassNames}
          />
        </LabelField>

        <LabelField
          label="Opis"
          id="description"
          errors={errors.description as any}
        >
          <textarea
            {...register('description', { required: 'Opis jest wymagany.' })}
            rows={4}
            className={textAreaClassNames}
          />
        </LabelField>

        <LabelField
          label="Liczba miejsc"
          id="seats"
          errors={errors.seats as any}
        >
          <select {...register('seats')} className={selectClassNames}>
            <option value="2">2</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="7">7</option>
          </select>
        </LabelField>
        <LabelField
          label="Lokalizacje"
          id="locations" // Użyj 'locations' jako ID dla tego bloku
          errors={errors.locations as any}
        >
          <div className="flex flex-wrap gap-4">
            {locations.map(({ location_id, location_name }) => (
              <label key={location_id} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  value={location_id}
                  {...register('locations', {
                    required: 'Wybierz co najmniej jedną lokalizację.',
                  })}
                  className="h-5 w-5 rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
                <span>{location_name}</span>
              </label>
            ))}
          </div>
        </LabelField>

        <button
          type="submit"
          className="mt-6 w-full rounded bg-green-600 py-3 text-lg font-semibold text-white hover:bg-green-700 focus:ring-4 focus:ring-green-300 focus:outline-none"
        >
          Dodaj samochód
        </button>
      </form>
    </div>
  );
}
