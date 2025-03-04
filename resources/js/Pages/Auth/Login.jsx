import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { login } from '@/utils/loginService';
import { useState } from 'react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, processing, errors: formErrors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });
    
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const submit = async (e) => {
        e.preventDefault();
        
        // Check for empty email and password fields
        const newErrors = {};
        if (!data.email) {
            newErrors.email = 'Email field is required';
        }
        if (!data.password) {
            newErrors.password = 'Password field is required';
        }
        
        // Only proceed with submission if there are no empty fields
        if (Object.keys(newErrors).length === 0) {
            setIsSubmitting(true);
            
            try {
                // Use our custom login service instead of Inertia
                console.log('Submitting login credentials...');
                const response = await login({
                    email: data.email,
                    password: data.password
                });
                console.log('Login successful:', {
                    hasToken: !!response.data?.token,
                    data: response.data
                });
                
                // If login successful, reset form and redirect to dashboard
                reset('password');
                window.location.href = '/dashboard';
            } catch (error) {
                // Handle login error
                console.error('Login failed:', error);
                
                // Set error messages from the API response if available
                if (error.response?.data?.errors) {
                    setErrors(error.response.data.errors);
                } else {
                    setErrors({ 
                        email: 'Authentication failed. Please check your credentials.' 
                    });
                }
            } finally {
                setIsSubmitting(false);
            }
        } else {
            // Set errors for empty fields
            setErrors(newErrors);
        }
    };

    return (
        <GuestLayout>
            <Head title="Log in" />

            {status && (
                <div className="mb-4 text-sm font-medium text-green-600">
                    {status}
                </div>
            )}

            <form onSubmit={submit}>
                <div>
                    <InputLabel htmlFor="email" value="Email" />

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full"
                        autoComplete="username"
                        isFocused={true}
                        onChange={(e) => setData('email', e.target.value)}
                    />

                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="password" value="Password" />

                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full"
                        autoComplete="current-password"
                        onChange={(e) => setData('password', e.target.value)}
                    />

                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="mt-4 block">
                    <label className="flex items-center">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            onChange={(e) =>
                                setData('remember', e.target.checked)
                            }
                        />
                        <span className="ms-2 text-sm text-gray-600">
                            Remember me
                        </span>
                    </label>
                </div>

                <div className="mt-4 flex items-center justify-end">
                    {canResetPassword && (
                        <Link
                            href={route('password.request')}
                            className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                            Forgot your password?
                        </Link>
                    )}

                    <PrimaryButton className="ms-4" disabled={processing}>
                        Log in
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}
