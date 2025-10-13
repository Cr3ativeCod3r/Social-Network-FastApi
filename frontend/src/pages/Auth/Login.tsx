import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAuthStore } from '../../store/authStore';
import { useNavigate } from 'react-router-dom';
import Input from './components/Input';
import { Mail, Lock } from 'lucide-react';
import PortalCard from './components/PortalCard';

const loginSchema = Yup.object({
  email: Yup.string()
    .email('Nieprawidłowy adres email')
    .required('Email jest wymagany'),
  password: Yup.string()
    .min(4, 'Hasło musi mieć co najmniej 6 znaków')
    .required('Hasło jest wymagane'),
});

const Login: React.FC = () => {
  const { login, isLoading, error, clearError } = useAuthStore();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: loginSchema,
    onSubmit: async (values) => {
      try {
        await login(values.email, values.password);
        navigate('/notatki');
      } catch (err) {
        console.log(err)
      }
    },
  });

  React.useEffect(() => {
    return () => {
      clearError();
    };
  }, [clearError]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-basic px-4">
      <div className="flex flex-col md:flex-row items-center md:items-start gap-8 w-full max-w-4xl animate-fade-in">
    
        <div className="w-full md:w-1/2 my-auto ">
          <PortalCard />
        </div>

        <div className="w-full md:w-1/2 bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-3xl font-bold text-center mb-8 text-basic1 flex items-center justify-center gap-2">
       
            Witamy ponownie
          </h2>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={formik.handleSubmit} className="space-y-6">
            <div>
              <Input
                type="email"
                name="email"
                placeholder="E-mail"
                icon={<Mail size={16} />}
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.email && formik.errors.email && (
                <p className="mt-1 text-sm text-red-600">{formik.errors.email}</p>
              )}
            </div>

            <div>
              <Input
                type="password"
                name="password"
                placeholder="Hasło"
                icon={<Lock size={16} />}
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.password && formik.errors.password && (
                <p className="mt-1 text-sm text-red-600">{formik.errors.password}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-basic1 text-white py-3 rounded-lg font-medium hover:bg-basic2 disabled:bg-green-400 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Logowanie...' : 'Zaloguj się'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Nie masz konta?{' '}
              <button
                onClick={() => navigate('/register')}
                className="text-basic1 hover:text-basic2 font-medium"
              >
                Zarejestruj się
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;