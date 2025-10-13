import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';
import Input from '../components/Input';
import { Mail, Lock, User, Building, BookOpen } from 'lucide-react';
import PortalCard from '../components/PortalCard';

const registerSchema = Yup.object({
    email: Yup.string()
        .email('Nieprawidłowy adres email')
        .required('Email jest wymagany'),
    password: Yup.string()
        .min(8, 'Hasło musi mieć co najmniej 8 znaków')
        .required('Hasło jest wymagane'),
    first_name: Yup.string()
        .min(2, 'Imię musi mieć co najmniej 2 znaki')
        .required('Imię jest wymagane'),
    last_name: Yup.string()
        .min(2, 'Nazwisko musi mieć co najmniej 2 znaki')
        .required('Nazwisko jest wymagane'),
    university: Yup.string()
        .min(2, 'Nazwa uczelni musi mieć co najmniej 2 znaki')
        .required('Uczelnia jest wymagana'),
    department: Yup.string()
        .min(2, 'Nazwa wydziału musi mieć co najmniej 2 znaki')
        .required('Wydział jest wymagany'),
});

const Register: React.FC = () => {
    const { register, isLoading, error, clearError } = useAuthStore();
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
            first_name: '',
            last_name: '',
            university: '',
            department: '',
        },
        validationSchema: registerSchema,
        onSubmit: async (values) => {
            try {
                await register({
                    email: values.email,
                    password: values.password,
                    first_name: values.first_name,
                    last_name: values.last_name,
                    university: values.university,
                    department: values.department,
                });
                navigate('/', { 
                    state: { message: 'Rejestracja zakończona pomyślnie! Możesz się teraz zalogować.' }
                });
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
        <div className="min-h-screen flex items-center justify-center bg-gradient-basic2 px-4 py-8">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8 w-full max-w-5xl animate-fade-in">

                <div className="w-full md:w-1/2 my-auto">
                    <PortalCard titleColor="text-second2"/>
                </div>

                <div className="w-full md:w-1/2 bg-white rounded-lg shadow-lg p-8">
                    <h2 className="text-3xl font-bold text-center mb-8 text-second2 flex items-center justify-center gap-2">
                        Dołącz do nas
                    </h2>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-red-800 text-sm">{error}</p>
                        </div>
                    )}

                    <form onSubmit={formik.handleSubmit} className="space-y-5">
                        <div>
                            <Input
                                type="email"
                                name="email"
                                placeholder="E-mail"
                                icon={<Mail size={16} />}
                                value={formik.values.email}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                textcolor="text-second2"
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
                                textcolor="text-second2"
                            />
                            {formik.touched.password && formik.errors.password && (
                                <p className="mt-1 text-sm text-red-600">{formik.errors.password}</p>
                            )}
                        </div>

                        <div>
                            <Input
                                type="text"
                                name="first_name"
                                placeholder="Imię"
                                icon={<User size={16} />}
                                value={formik.values.first_name}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                textcolor="text-second2"
                            />
                            {formik.touched.first_name && formik.errors.first_name && (
                                <p className="mt-1 text-sm text-red-600">{formik.errors.first_name}</p>
                            )}
                        </div>

                        <div>
                            <Input
                                type="text"
                                name="last_name"
                                placeholder="Nazwisko"
                                icon={<User size={16} />}
                                value={formik.values.last_name}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                textcolor="text-second2"
                            />
                            {formik.touched.last_name && formik.errors.last_name && (
                                <p className="mt-1 text-sm text-red-600">{formik.errors.last_name}</p>
                            )}
                        </div>

                        <div>
                            <Input
                                type="text"
                                name="university"
                                placeholder="Uczelnia"
                                icon={<Building size={16} />}
                                value={formik.values.university}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                textcolor="text-second2"
                            />
                            {formik.touched.university && formik.errors.university && (
                                <p className="mt-1 text-sm text-red-600">{formik.errors.university}</p>
                            )}
                        </div>

                        <div>
                            <Input
                                type="text"
                                name="department"
                                placeholder="Wydział"
                                icon={<BookOpen size={16} />}
                                value={formik.values.department}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                textcolor="text-second2"
                            />
                            {formik.touched.department && formik.errors.department && (
                                <p className="mt-1 text-sm text-red-600">{formik.errors.department}</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-second2 text-white py-3 rounded-lg font-medium hover:bg-second1 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors"
                        >
                            {isLoading ? 'Rejestracja...' : 'Zarejestruj się'}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-gray-600">
                            Masz już konto?{' '}
                            <button
                                onClick={() => navigate('/')}
                                className="text-second2 hover:text-second1 font-medium"
                            >
                                Zaloguj się
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;