import { Fragment, useState } from 'react'
import { useNavigate, Link } from "react-router-dom";
import { RegisterFormInterface } from '../interfaces/tsInterfaces';
import { Input, Button } from '@headlessui/react'
import { useMutation } from '@apollo/client';
import { REGISTER_USER } from '../graphql/mutations/register';
import { toast } from 'react-toastify';
import RegisterPageImage from '../assets/images/RegisterPageImage.webp';
import { User, Mail, KeyRound, RotateCcwKey } from 'lucide-react';
const Register = () => {
    const navigate = useNavigate();

    const [form, setForm] = useState<RegisterFormInterface>({ user_name: "", email: "", password: "", confirm_password: "", });
    const [passwordStrength, setPasswordStrength] = useState<number>(0);
    const [passwordFeedback, setPasswordFeedback] = useState<string>('');

    const [registerUser, { loading, error }] = useMutation(REGISTER_USER, { onCompleted: () => navigate("/"), });
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target; setForm({ ...form, [name]: value });
        if (name === "password") { evaluatePasswordStrength(value); }
    }

    const evaluatePasswordStrength = (password: string) => {
        let score = 0;
        if (password.length >= 6) score += 1;
        if (/[A-Z]/.test(password)) score += 1;
        if (/[0-9]/.test(password)) score += 1;
        if (/[^A-Za-z0-9]/.test(password)) score += 1;

        setPasswordStrength(score);

        if (score <= 1) setPasswordFeedback("Weak Password Security");
        else if (score === 2) setPasswordFeedback("Moderate Password Security");
        else if (score >= 3) setPasswordFeedback("Strong Password Security");
    };

    const handleRegister = async () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (form.user_name === "" || form.email === "" || form.password === "" || form.confirm_password === "") { toast.warning("All fields are mandatory", { toastId: "fill-fields" }); return; }
        if (!emailRegex.test(form.email)) { toast.warning("You must type in a valid email", { toastId: "invalid-email" }); return; }
        if (form.password !== form.confirm_password) { toast.warning("Passwords do not match", { toastId: "password-match" }); return; }

        try {
            const { data } = await registerUser({
                variables: {
                    user_name: form.user_name,
                    email: form.email,
                    password: form.password,
                }
            });
            console.log('data:', data);
            setForm({ user_name: "", email: "", password: "", confirm_password: "" });
            toast.success("You signed up successfully", { toastId: "register-success" });
        } catch (error) {
            console.error('error:', error);
            toast.error("Somenthing went wrong", { toastId: 'server-error' })
        }
    }

    return (
        <Fragment>
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                <div className="w-full grid grid-cols-1 md:grid-cols-2 max-w-4xl bg-white rounded-lg shadow overflow-hidden dark:border dark:bg-gray-800 dark:border-gray-700">
                    <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                        <div className="p-6 space-y-6 md:space-y-6 sm:p-8 text-center">

                            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                                Sign Up
                            </h1>

                            <div>
                                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                    User Name
                                </label>
                                <div className="relative">
                                    <span className="bg-neutral-800 rounded-l-xl absolute inset-y-0 left-0 pl-1 flex items-center pointer-events-none">
                                        <User className="h-7 w-7 text-white" />
                                    </span>
                                    <Input onChange={handleChange} className="w-full h-12 pl-10 pr-4 rounded-l-2xl bg-neutral-100 text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" name="user_name" type="text"></Input>
                                </div>
                            </div>

                            <div>
                                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                    E-mail
                                </label>
                                <div className="relative">
                                    <span className="bg-neutral-800 rounded-l-xl absolute inset-y-0 left-0 pl-1 flex items-center pointer-events-none">
                                        <Mail className="h-7 w-7 text-white" />
                                    </span>
                                    <Input onChange={handleChange} className="w-full h-12 pl-10 pr-4 rounded-l-2xl bg-neutral-100 text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" name="email" type="email"></Input>
                                </div>
                            </div>

                            <div>
                                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                    Password
                                </label>
                                <div className="relative">
                                    <span className="bg-neutral-800 rounded-l-xl absolute inset-y-0 left-0 pl-1 flex items-center pointer-events-none">
                                        <KeyRound className="h-7 w-7 text-white" />
                                    </span>
                                    <Input onChange={handleChange} className="w-full h-12 pl-10 pr-4 rounded-l-2xl bg-neutral-100 text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" name="password" type="password"></Input>
                                </div>

                                <div className="mt-2 w-full h-2 bg-gray-300 rounded">
                                    <div
                                        className={`h-full rounded transition-all duration-300 ${passwordStrength === 1 ? 'w-1/4 bg-red-500' :
                                            passwordStrength === 2 ? 'w-2/4 bg-yellow-500' :
                                                passwordStrength === 3 ? 'w-3/4 bg-blue-500' :
                                                    passwordStrength === 4 ? 'w-full bg-green-500' : 'w-0'
                                            }`}
                                    />
                                </div>
                                <p className="text-sm mt-1 text-gray-600 dark:text-gray-300">{passwordFeedback}</p>
                            </div>

                            <div>
                                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                    Confirm Password
                                </label>
                                <div className="relative">
                                    <span className="bg-neutral-800 rounded-l-xl absolute inset-y-0 left-0 pl-1 flex items-center pointer-events-none">
                                        <RotateCcwKey className="h-7 w-7 text-white" />
                                    </span>
                                    <Input onChange={handleChange} className="w-full h-12 pl-10 pr-4 rounded-l-2xl bg-neutral-100 text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" name="confirm_password" type="password"></Input>
                                </div>

                            </div>
                            <div className='mb-2 mt-6'>
                                <Button onClick={handleRegister} disabled={loading} className="w-full rounded bg-sky-600 px-4 py-2 text-sm text-white data-active:bg-sky-700 data-hover:bg-sky-500">
                                    {loading ? "Signing up..." : "Sign up!"}
                                </Button>
                                {error && <p className="text-red-500">Error: {error.message} </p>}
                            </div>
                            <p className="text-sm  text-gray-500 dark:text-gray-400 font-semibold">
                                Already have an account?
                            </p>

                            <Link to="/" className="text-white font-bold hover:underline hover:text-cyan-300 dark:text-primary-500">
                                Login
                            </Link>

                        </div>
                    </div>
                    <div className="hidden md:block h-full w-full">
                        <img
                            src={RegisterPageImage}
                            alt="Register Page Image"
                            className="h-full w-full rounded-r-lg"
                        />
                    </div>
                </div>
            </div>
        </Fragment >
    )
}

export default Register