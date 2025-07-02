import { Fragment, useState } from "react";
import client from '../graphql/apolloClient';
import { LoginFormInterface } from "../interfaces/tsInterfaces";
import { LOGIN_USER } from "../graphql/mutations/login";
import { ApolloError, useMutation } from '@apollo/client';
import { useNavigate, Link } from "react-router-dom";
import { Input, Button } from '@headlessui/react'
import { toast } from "react-toastify";
import { Mail, KeyRound } from 'lucide-react';
import KanbanLogo from '../assets/images/KanbanLogo.webp';

const Login = () => {
    const navigate = useNavigate();

    const [form, setForm] = useState<LoginFormInterface>({ email: "", password: "" });


    const [loginUser, { loading, error }] = useMutation(LOGIN_USER, {
        onCompleted: async (data) => {
            if (data?.login?.token) {
                sessionStorage.setItem("token", data.login.token);
                sessionStorage.setItem("user", JSON.stringify(data.login.user));
                await client.clearStore();
                navigate("/Dashboard");
            }
        }
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => { setForm({ ...form, [e.target.name]: e.target.value }) }

    const handleLogin = async () => {
        if (form.email === '' || form.password === '') { toast.warning("Fill in all fields", { toastId: "empty-fields", }); return; }

        try {

            const { data } = await loginUser({
                variables: {
                    email: form.email,
                    password: form.password,
                }
            });

            if (data && data.login) { sessionStorage.setItem("token", data.login.token); sessionStorage.setItem("userId", data.login.user.id); }


        } catch (error) {
            const apolloError = error as ApolloError;
            const graphQLError = apolloError.graphQLErrors?.[0];
            if (graphQLError?.extensions?.code === "INVALID_CREDENTIALS") {
                toast.warning("Invalid email or password", { toastId: "invalid-credentials" });
            } else {
                toast.error("Something went wrong", { toastId: "generic-error" });
            }
            console.error(apolloError.graphQLErrors);
        }
    };

    return (
        <Fragment>
            <div className="flex flex-col items-center justify-center min-h-screen px-6 py-8 mx-auto md:h-screen lg:py-0">
                <div className="w-full grid grid-cols-1 md:grid-cols-2 max-w-4xl bg-white rounded-lg shadow overflow-hidden dark:border dark:bg-gray-800 dark:border-gray-700">
                    <form className="space-y-6" >
                        <div className="p-6 space-y-4 md:space-y-6 sm:p-8 text-center">
                            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                                Login
                            </h1>
                            <div>
                                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                    E-Mail
                                </label>

                                <div className="relative">
                                    <span className="bg-neutral-800 rounded-l-xl absolute inset-y-0 left-0 pl-1 flex items-center pointer-events-none">
                                        <Mail className="h-7 w-7 text-white" />
                                    </span>
                                    <Input onChange={handleChange} className="w-full h-12 pl-10 pr-4 rounded-l-2xl bg-neutral-100 text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" name="email" type="email" placeholder="email@site.com"></Input>
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
                                    <Input onChange={handleChange} className="w-full h-12 pl-10 pr-4 rounded-l-2xl bg-neutral-100 text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" name="password" type="password" placeholder="Password"></Input>
                                </div>
                            </div>
                            {/* <div className="flex items-center justify-between">
                                <div className="flex items-start">
                                    <div className="flex items-center h-5">
                                        <input id="remember" aria-describedby="remember" type="checkbox" className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800" />
                                    </div>
                                    
                                    <div className="ml-3 text-sm">
                                        <label className="text-gray-500 dark:text-gray-300">
                                            Remember me
                                        </label>
                                    </div>
                                </div>
                                <a href="#" className="text-white text-sm font-semibold text-primary-600 hover:underline dark:text-primary-500">
                                    Forgotten Password?
                                </a>
                            </div> */}
                            {/*  */}
                            <div>
                                <Button onClick={handleLogin} disabled={loading} className="w-full rounded bg-sky-600 px-4 py-2 text-sm text-white
                                 data-active:bg-sky-700 data-hover:bg-sky-500 hover:cursor-pointer">
                                    {loading ? "Loggin in..." : "Login!"}
                                </Button>
                                {error && <p className="text-red-500">Error: {error.message} </p>}
                            </div>
                            <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                                Don't have an account?{" "}

                                <Link to='/Register' className="font-medium text-primary-600 hover:underline hover:text-cyan-300 dark:text-primary-500">
                                    Register
                                </Link>
                            </p>
                        </div>
                    </form>
                    <div className="hidden md:block h-full w-full">
                        <img src={KanbanLogo} alt="Kanban Logo" className="h-full w-full rounded-r-lg" />
                    </div>
                </div>
            </div>
        </Fragment>
    );
};

export default Login;
