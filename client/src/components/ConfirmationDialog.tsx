import { Fragment } from 'react';
import { ConfirmationDialogInterface } from '../interfaces/tsInterfaces';
import { Dialog, DialogPanel, DialogTitle, Transition, Button } from '@headlessui/react'
import { Trash2, MessageSquareWarning } from 'lucide-react';

const ConfirmationDialog = ({ title, description, open, action, onClose, onConfirm }: ConfirmationDialogInterface) => {

    return (
        <Fragment>
            <Dialog open={open} as="div" className="relative z-10 focus:outline-none" onClose={onClose}>

                <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4">
                        <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95" >
                            <DialogPanel transition
                                className="w-full max-w-md rounded-xl bg-neutral-800 p-6 backdrop-blur-2xl duration-300 ease-out data-closed:transform-[scale(95%)] data-closed:opacity-0"
                            >
                                <DialogTitle as="h3" className="text-center text-base/7 font-bold text-white">
                                    {title}
                                </DialogTitle>
                                <MessageSquareWarning className="text-red-600" />

                                <p className="mt-2 text-sm/6 text-gray-300">
                                    {description}
                                </p>

                                <div className="mt-4 space-x-6">
                                    <Button
                                        className="hover:cursor-pointer inline-flex items-center gap-2 rounded-md bg-green-600 hover:bg-green-700 px-13 py-2 text-sm/6 font-semibold text-white"
                                        onClick={onClose}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        className="hover:cursor-pointer inline-flex items-center gap-2 rounded-md bg-red-700 hover:bg-red-800 px-6 py-2 text-sm/6 font-semibold text-white"
                                        onClick={onConfirm}
                                    >
                                        {action}
                                        <Trash2 className="text-white" />

                                    </Button>
                                </div>
                            </DialogPanel>
                        </Transition.Child>

                    </div>
                </div>
            </Dialog>
        </Fragment>
    )
}

export default ConfirmationDialog