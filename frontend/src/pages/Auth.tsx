import { useState } from 'react';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { loginUser, registerUser } from '../api/authApi';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import type { formValues } from '../utils/types';
import CarPhoto from '../assets/car_logo.jpg';
import { useAuth } from '../auth/AuthContext';
import LabelField from '../components/Label';

export default function Auth() {
  const [formMode, setFormMode] = useState<'login' | 'register'>('login');
  const { login } = useAuth();

  const loginSchema = Yup.object({
    email: Yup.string().email('Niepoprawny email').required('Wymagany e-mail'),
    password: Yup.string()
      .min(8, 'Hasło musi mieć co najmniej 8 znaków')
      .required('Wymagane hasło'),
  });

  const registerSchema = loginSchema.shape({
    passwordConfirmation: Yup.string()
      .oneOf([Yup.ref('password')], 'Hasła muszą być takie same')
      .required('Potwierdzenie hasła jest wymagane'),
  });

  const validationSchema =
    formMode === 'register' ? registerSchema : loginSchema;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<formValues>({
    defaultValues: {
      email: 'test1@example.com',
      password: 'testsad1',
      passwordConfirmation: 'testsad1',
    },
    resolver: yupResolver(validationSchema),
  });

  const { mutate: mutateRegistration } = useMutation({
    mutationFn: (payload: { email: string; password: string }) =>
      registerUser(payload),
    onSuccess: () => {
      toast.success('Zarejestrowano pomyślnie!');
      setFormMode('login');
    },
    onError: (error: any) => {
      toast.error(error.response.data.message);
    },
  });

  const { mutate: mutateLogin } = useMutation({
    mutationFn: (payload: { email: string; password: string }) =>
      loginUser(payload),
    onSuccess: (data) => {
      toast.success('Zalogowano pomyślnie');
      login({ token: data.access_token, user: data.user });
    },
    onError: (error: any) => {
      toast.error(error.response.data.message);
    },
  });

  const onSubmit = async (data: formValues) => {
    try {
      if (formMode === 'login') {
        mutateLogin({ email: data.email, password: data.password });
      } else {
        mutateRegistration({ email: data.email, password: data.password });
      }
    } catch (err: any) {
      toast.error(err.response.data.message);
    }
  };

  const inputClassNames = 'w-full rounded border px-3 py-2 shadow-sm';

  return (
    <div className="flex flex-row">
      {/* Zdjęcie */}
      <div className="relative hidden h-90 overflow-hidden rounded-l-lg lg:flex">
        <img
          src={CarPhoto}
          alt="Smart Car"
          className="h-full w-full object-cover opacity-[33%]"
        />
        <div className="absolute top-1/2 left-1/2 z-10 flex w-full -translate-x-1/2 -translate-y-1/2 p-4">
          <p className="w-full text-center text-3xl leading-[4rem] font-bold uppercase">
            Wynajem samochdów w kilkunastu lokalicjach
          </p>
        </div>
      </div>

      {/* Formularz */}
      <div className="mx-auto h-90 max-w-md rounded-r-lg bg-white p-8 shadow">
        <h2 className="mb-4 text-center text-2xl font-bold uppercase">
          {formMode === 'login' ? 'Zaloguj się' : 'Zarejestruj się'}
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <LabelField label="Email" id="email" errors={errors.email as any}>
            <input
              type="email"
              {...register('email')}
              className={inputClassNames}
              placeholder="email@example.com"
            />
          </LabelField>

          <LabelField
            label="Hasło"
            id="password"
            errors={errors.password as any}
          >
            <input
              type="password"
              {...register('password')}
              className={inputClassNames}
              placeholder="••••••••"
            />
          </LabelField>

          {formMode === 'register' && (
            <LabelField
              label="Potwierdź hasło"
              id="passwordConfirmation"
              errors={errors.passwordConfirmation as any}
            >
              <input
                type="password"
                {...register('passwordConfirmation')}
                className={inputClassNames}
                placeholder="••••••••"
              />
            </LabelField>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded bg-green-600 py-2 text-white hover:bg-green-700"
          >
            {formMode === 'login' ? 'Zaloguj się' : 'Zarejestruj się'}
          </button>
        </form>

        <div className="mt-4 text-center">
          {formMode === 'login' ? (
            <p>
              Nie masz konta?{' '}
              <button
                onClick={() => setFormMode('register')}
                className="font-bold text-green-600 hover:underline"
              >
                Zarejestruj się
              </button>
            </p>
          ) : (
            <p>
              Masz już konto?{' '}
              <button
                onClick={() => setFormMode('login')}
                className="font-bold text-green-600 hover:underline"
              >
                Zaloguj się
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
