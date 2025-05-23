import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useUtils } from '../contexts/UtilsContext';
import toast from 'react-hot-toast';
import { addCar } from '../api/carsApi';

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
    onError: () => {
      toast.error('Wystąpił błąd przy dodawaniu auta.');
    },
  });

  const onSubmit = (data: any) => {
    console.log(data);
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
            {...register('carPhoto', { required: 'Zdjęcie jest wymagane.' })}
            className="hidden"
          />
          {errors.carPhoto?.message && (
            <p className="text-red-500">{String(errors.carPhoto.message)}</p>
          )}
        </div>

        <div>
          <label className="mb-2 block font-semibold text-gray-700">
            Marka
          </label>
          <select
            {...register('brand', { required: 'Wybierz markę.' })}
            className="w-full rounded border border-gray-300 bg-white p-2 text-gray-700 transition focus:border-green-500 focus:ring-2 focus:ring-green-300 focus:outline-none"
          >
            <option value="">-- Wybierz markę --</option>
            {brands.map(({ brand_id, brand_name }) => (
              <option key={brand_id} value={brand_name}>
                {brand_name}
              </option>
            ))}
          </select>
          {errors.brand?.message && (
            <p className="mt-1 text-sm text-red-600">
              {String(errors.brand.message)}
            </p>
          )}
        </div>

        <div>
          <label className="mb-2 block font-semibold text-gray-700">
            Model
          </label>
          <input
            type="text"
            {...register('model', { required: 'Model jest wymagany.' })}
            className="w-full rounded border border-gray-300 bg-white p-2 text-gray-700 transition focus:border-green-500 focus:ring-2 focus:ring-green-300 focus:outline-none"
          />
          {errors.model?.message && (
            <p className="mt-1 text-sm text-red-600">
              {String(errors.model.message)}
            </p>
          )}
        </div>

        <div>
          <label className="mb-2 block font-semibold text-gray-700">Cena</label>
          <input
            type="number"
            {...register('price', { required: 'Cena jest wymagana.' })}
            className="w-full rounded border border-gray-300 bg-white p-2 text-gray-700 transition focus:border-green-500 focus:ring-2 focus:ring-green-300 focus:outline-none"
          />
          {errors.price?.message && (
            <p className="mt-1 text-sm text-red-600">
              {String(errors.price.message)}
            </p>
          )}
        </div>

        <div>
          <label className="mb-2 block font-semibold text-gray-700">
            Rok produkcji
          </label>
          <input
            type="number"
            {...register('productionYear', { required: 'Rok jest wymagany.' })}
            className="w-full rounded border border-gray-300 bg-white p-2 text-gray-700 transition focus:border-green-500 focus:ring-2 focus:ring-green-300 focus:outline-none"
          />
          {errors.productionYear?.message && (
            <p className="mt-1 text-sm text-red-600">
              {String(errors.productionYear.message)}
            </p>
          )}
        </div>

        <div>
          <label className="mb-2 block font-semibold text-gray-700">Opis</label>
          <textarea
            {...register('description', { required: 'Opis jest wymagany.' })}
            rows={4}
            className="w-full resize-none rounded border border-gray-300 bg-white p-2 text-gray-700 transition focus:border-green-500 focus:ring-2 focus:ring-green-300 focus:outline-none"
          />
          {errors.description?.message && (
            <p className="mt-1 text-sm text-red-600">
              {String(errors.description.message)}
            </p>
          )}
        </div>

        <div>
          <label className="mb-2 block font-semibold text-gray-700">
            Liczba miejsc
          </label>
          <select
            {...register('seats')}
            className="w-full rounded border border-gray-300 bg-white p-2 text-gray-700 transition focus:border-green-500 focus:ring-2 focus:ring-green-300 focus:outline-none"
          >
            <option value="2">2</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="7">7</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block font-semibold text-gray-700">
            Lokalizacje
          </label>
          <div className="flex flex-wrap gap-4">
            {locations.map(({ location_id, location_name }) => (
              <label key={location_id} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  value={location_name}
                  {...register('locations')}
                  className="h-5 w-5 rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
                <span>{location_name}</span>
              </label>
            ))}
          </div>
          {errors.locations?.message && (
            <p className="mt-1 text-sm text-red-600">
              {String(errors.locations.message)}
            </p>
          )}
        </div>

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
