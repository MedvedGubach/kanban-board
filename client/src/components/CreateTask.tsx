import { Fragment, useState } from 'react';
import { useMutation } from '@apollo/client';
import { NEW_TASK } from '../graphql/mutations/tasks';
import { GET_TASKS } from '../graphql/queries/getTasks';
import { Input, Button } from '@headlessui/react';
import { Link } from 'react-router-dom';
import { ArrowLeftToLine, LayoutList, LoaderPinwheel } from 'lucide-react';
import { toast } from 'react-toastify';

const CreateTask = ({ board }: { board: string }) => {

    const [form, setForm] = useState({ title: "", description: "", });
    const [createTaskMutation, { loading }] = useMutation(NEW_TASK);


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    const handleCreate = async () => {
        const userId = sessionStorage.getItem("userId");
        if (!userId) { toast.error("User not logged in"); return; }
        if (form.title === '' || form.description === '') { toast.warning("Task must have a title and description", { toastId: 'task-empty-fields' }); return; }

        try {
            const { data } = await createTaskMutation({
                variables: {
                    title: form.title,
                    description: form.description,
                    board: board,
                },
                refetchQueries: [{ query: GET_TASKS, variables: { board } }]
            })
            console.log(data);
            setForm({ title: "", description: "" });
            toast.success("Task created successfully", { toastId: 'task-created' })

        } catch (error) {
            console.log(error);
            toast.error("Somenthing went wrong :", { toastId: 'server-error' })
        }
    }

    return (
        <Fragment>
            <div className="container mx-auto w-full">
                <div className="flex justify-start p-4">
                    <Link to="/Dashboard">
                        <ArrowLeftToLine className="text-white hover:bg-yellow-500 rounded-2xl transition duration-200" />
                    </Link>
                </div>
                <div className="space-x-6">
                    <Input value={form.title} name="title" placeholder="Task Title" onChange={handleChange} type="text" className="h-12 bg-neutral-100 text-black rounded-lg" />
                    <Input value={form.description} name="description" placeholder="Task Description" onChange={handleChange} type="text" className="h-12 bg-neutral-100 text-black rounded-lg" />
                    <Button onClick={handleCreate} disabled={loading} className="rounded-xl bg-sky-600 px-4 py-2 text-sm text-white data-active:bg-sky-700 data-hover:bg-sky-500 hover:cursor-pointer">
                        {loading ?
                            <span className="flex items-center gap-2 text-white font-semibold">
                                Creating...
                                <LoaderPinwheel className="animate-spin h-6 w-6" />
                            </span>
                            : (<span className="flex items-center gap-2 text-white font-semibold">Create Task<LayoutList /></span>)}
                    </Button>
                </div>
            </div>
        </Fragment>
    )
}

export default CreateTask