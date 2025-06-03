import { Fragment } from 'react'
import { Button } from '@headlessui/react'
import { useNavigate } from 'react-router-dom'
import { LogOut } from 'lucide-react';
import client from '../graphql/apolloClient';
import KanbanIcon from '../assets/images/KanbanIcon.webp';
const Navbar = () => {

    const navigate = useNavigate();
    const handleLogout = async () => { sessionStorage.clear(); localStorage.clear(); await client.clearStore(); navigate("/", { replace: true }); }

    return (
        <Fragment>
            <nav className="top-0 z-50 mb-10 py-3 px-1 sm:px-1 lg:px-4 flex items-center justify-between bg-neutral-950/90">
                <div className="flex items-center gap-1 xl:gap-3 text-white font-semibold text-xl flex-shrink-0 font-serif">
                    <img src={KanbanIcon} alt="Kanban Icon" height={60} width={60} className="mx-2 h-16 w-16 rounded-xl" />
                    📋 KanbanPro
                </div>

                <div className="flex items-center px-3">
                    <Button
                        onClick={handleLogout}
                        className=" sm:gap-0 xl:gap-2 rounded inline-flex bg-red-600 px-4 py-2 text-md text-white hover:bg-red-700 hover:cursor-pointer transition duration-200"
                    >
                        Logout
                        <LogOut />
                    </Button>
                </div>
            </nav>
        </Fragment>
    )
}

export default Navbar