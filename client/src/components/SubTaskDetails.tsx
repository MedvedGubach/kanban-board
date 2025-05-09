import { Fragment, useState, useEffect } from 'react';
import CreateSubTasks from './CreateSubTasks';
import { GetSubTasksInterface } from '../interfaces/tsInterfaces';
import { useQuery } from '@apollo/client';
import { useMutation } from '@apollo/client';
import { GET_SUBTASKS } from '../graphql/queries/getSubTasks';
import { UPDATE_SUBTASK_STATUS } from '../graphql/mutations/updateSubTaskStatus';
import { Dialog, DialogPanel, DialogTitle, Transition, Checkbox } from '@headlessui/react'
import { toast } from 'react-toastify';
import { Megaphone, CalendarClock } from 'lucide-react';

const SubTaskDetails = ({ title, taskId, open, onClose }: { title: string, taskId: string, open: boolean, onClose: () => void; }) => {

    const [checkboxStates, setCheckboxStates] = useState<{ [key: string]: boolean }>({});
    const [updateSubTaskStatus] = useMutation(UPDATE_SUBTASK_STATUS);
    const { data,/*  loading, */ /* error */ } = useQuery(GET_SUBTASKS, { variables: { taskId: taskId } });

    const handleCheckboxChange = async (subTaskId: string, e: boolean) => {
        setCheckboxStates(prevState => ({ ...prevState, [subTaskId]: e }));

        const userId = sessionStorage.getItem("userId");
        if (!userId) { toast.error("User not logged in"); return; }

        const subTaskStatus = e ? "Complete" : "Pending";

        try {
            const { data } = await updateSubTaskStatus({
                variables: {
                    id: subTaskId,
                    subTaskStatus: subTaskStatus
                }
            })

            toast.success(`Sub-Task status updated successfuly to: ${subTaskStatus}.`, { autoClose: 2000 })
            console.log(data);
        } catch (error) {
            console.log('error---', error);
            toast.error("Something went wrong:", { toastId: 'server-error' })
        }
    };

    useEffect(() => {
        if (data?.getSubTasks) {
            const initialStates: { [key: string]: boolean } = {};
            data.getSubTasks.forEach((subtask: GetSubTasksInterface) => {
                initialStates[subtask.id] = subtask.subTaskStatus === 'Complete';
            });
            setCheckboxStates(initialStates);
        }
    }, [data]);


    return (
        <Fragment>
            <Dialog open={open} as="div" className="relative z-10 focus:outline-none" onClose={onClose}>
                <div className="fixed inset-0 z-10 max-w-screen">
                    <div className="flex min-h-full items-center justify-center p-4">
                        <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95" >
                            <DialogPanel transition
                                className="w-full max-w-7xl h-[90vh] rounded-xl bg-neutral-800 p-6 backdrop-blur-2xl duration-300 ease-out data-closed:transform-[scale(95%)] data-closed:opacity-0"
                            >
                                <div className="overflow-y-auto h-full overflow-x-hidden">
                                    {/* Create sub-task component */}
                                    <CreateSubTasks taskId={taskId} />
                                    <DialogTitle as="h3" className="text-center text-base/7 font-bold text-white">
                                        {title}
                                    </DialogTitle>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                        {
                                            data?.getSubTasks?.map((subtasks: GetSubTasksInterface, index: number) => (
                                                <Fragment key={index}>
                                                    <div className=" relative bg-yellow-200 p-4 rounded-lg shadow-md w-64 h-64 m-4">
                                                        <div className={`absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2
                                                             border-white shadow ${subtasks.subTaskStatus === "Pending" ? "bg-red-600" : "bg-blue-600"}`}
                                                        />
                                                        <div className="text-center mb-2">
                                                            <h1 className="text-black font-bold text-lg break-words line-clamp-3"> #{index + 1} {subtasks.title}</h1>
                                                        </div>

                                                        <div className="overflow-y-auto max-h-20 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
                                                            <p className="text-black font-semibold text-md break-words">{subtasks.subTask}</p>
                                                        </div>

                                                        <div className="absolute bottom-1 left-2 z-10">
                                                            <p className="flex items-center gap-1">
                                                                Priority: {subtasks.priority}
                                                                <Megaphone className={subtasks.priority === "Low" ? "text-green-500"
                                                                    : subtasks.priority === "Medium" ? "text-orange-400" : "text-red-500"} size={24}
                                                                />
                                                            </p>
                                                            <p className="flex items-center gap-1">Due Date: {subtasks.dueDate} <CalendarClock size={24} /> </p>
                                                        </div>

                                                        <div className="absolute bottom-2 right-2 z-10">
                                                            <Checkbox
                                                                checked={checkboxStates[subtasks.id] || false}
                                                                onChange={(e) => handleCheckboxChange(subtasks.id, e)}
                                                                className="group block size-4 rounded border bg-white data-checked:bg-blue-500"
                                                            >
                                                                <svg className="stroke-white opacity-0 group-data-checked:opacity-100" viewBox="0 0 14 14" fill="none">
                                                                    <path d="M3 8L6 11L11 3.5" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                                                                </svg>
                                                            </Checkbox>
                                                        </div>
                                                    </div>
                                                </Fragment>
                                            ))
                                        }
                                    </div>

                                    {/*   <div className="mt-4 space-x-6">
                                    <Button
                                        className="hover:cursor-pointer inline-flex items-center gap-2 rounded-md bg-gray-700 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:not-data-focus:outline-none data-focus:outline data-focus:outline-white data-hover:bg-gray-600 data-open:bg-gray-700"
                                        onClick={onClose}
                                    >
                                        Close
                                    </Button>
                                </div> */}
                                </div>
                            </DialogPanel>
                        </Transition.Child>

                    </div>
                </div>
            </Dialog>
        </Fragment >
    )
}

export default SubTaskDetails