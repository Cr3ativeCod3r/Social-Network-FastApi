import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';
import Input from '../common/Input';
import { Mail, Lock, User, Calendar, UserPlus } from 'lucide-react';
import PortalCard from '../common/PortalCard';

const registerSchema = Yup.object({
    email: Yup.string()
        .email('Nieprawidłowy adres email')
        .required('Email jest wymagany'),
    password: Yup.string()
        .min(6, 'Hasło musi mieć co najmniej 6 znaków')
        .required('Hasło jest wymagane'),
    firstName: Yup.string()
        .min(2, 'Imię musi mieć co najmniej 2 znaki')
        .required('Imię jest wymagane'),
    lastName: Yup.string()
        .min(2, 'Nazwisko musi mieć co najmniej 2 znaki')
        .required('Nazwisko jest wymagane'),
    dateOfBirth: Yup.date()
        .max(new Date(), 'Data urodzenia nie może być z przyszłości')
        .required('Data urodzenia jest wymagana'),
});

const Register: React.FC = () => {
    const { register, isLoading, error, clearError } = useAuthStore();
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
            firstName: '',
            lastName: '',
            dateOfBirth: '',
        },
        validationSchema: registerSchema,
        onSubmit: async (values) => {
            try {
                await register({
                    email: values.email,
                    password: values.password,
                    firstName: values.firstName,
                    lastName: values.lastName,
                    dateOfBirth: values.dateOfBirth,
                });
                navigate('/empty');
            } catch (err) {
                // Błąd jest obsługiwany w store
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
                        <UserPlus className="w-8 h-8" />
                        Rejestracja
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
                                name="firstName"
                                placeholder="Imię"
                                icon={<User size={16} />}
                                value={formik.values.firstName}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                textcolor="text-second2"
                            />
                            {formik.touched.firstName && formik.errors.firstName && (
                                <p className="mt-1 text-sm text-red-600">{formik.errors.firstName}</p>
                            )}
                        </div>

                        <div>
                            <Input
                                type="text"
                                name="lastName"
                                placeholder="Nazwisko"
                                icon={<User size={16} />}
                                value={formik.values.lastName}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                textcolor="text-second2"
                            />
                            {formik.touched.lastName && formik.errors.lastName && (
                                <p className="mt-1 text-sm text-red-600">{formik.errors.lastName}</p>
                            )}
                        </div>

                        <div>
                            <Input
                                type="date"
                                name="dateOfBirth"
                                placeholder="Data urodzenia"
                                icon={<Calendar size={16} />}
                                value={formik.values.dateOfBirth}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                textcolor="text-second2"
                            />
                            {formik.touched.dateOfBirth && formik.errors.dateOfBirth && (
                                <p className="mt-1 text-sm text-red-600">{formik.errors.dateOfBirth}</p>
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
                                onClick={() => navigate('/login')}
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