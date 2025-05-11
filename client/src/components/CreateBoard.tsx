import { Fragment, useState } from 'react';
import { useMutation } from '@apollo/client';
import { NEW_BOARD } from '../graphql/mutations/newBoard';
import { GET_BOARDS } from '../graphql/queries/getBoards';
import { Input, Button } from '@headlessui/react';
import { SquareKanban, LoaderPinwheel } from 'lucide-react';
import { toast } from 'react-toastify';


const CreateBoard = () => {
    const [form, setForm] = useState({ title: "", description: "", });
    const [CreateBoard, { loading, error }] = useMutation(NEW_BOARD);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    const handleCreate = async () => {
        const userId = sessionStorage.getItem("userId");
        if (!userId) { toast.error("User not logged in"); return; }
        if (form.title === '' || form.description === '') { toast.warning("Boards must have a title and description", { toastId: 'task-empty-fields' }); return; }


        try {
            const { data } = await CreateBoard({
                variables: {
                    title: form.title,
                    description: form.description,
                },
                refetchQueries: [{ query: GET_BOARDS, variables: { userId } }]
            });

            setForm({ title: "", description: "" });
            toast.success("Board created successfully", { toastId: 'board-created' });
        } catch (error) {
            toast.error("Something went wrong", { toastId: 'board-created' });
        }
    }

    return (
        <Fragment>
            <div className="container mx-auto w-full">
                <div className="space-x-6">
                    <Input value={form.title} name="title" placeholder="Board Title" onChange={handleChange} type="text" className="h-12 bg-neutral-100 text-black rounded-lg" />
                    <Input value={form.description} name="description" placeholder="Board Description" onChange={handleChange} type="text" className="h-12 bg-neutral-100 text-black rounded-lg" />
                    <Button className="rounded-xl bg-sky-600 px-4 py-2 text-sm text-white data-active:bg-sky-700 data-hover:bg-sky-500 hover:cursor-pointer"
                        onClick={handleCreate} disabled={loading}>
                        {loading ? (
                            <span className="flex items-center gap-2 text-white font-semibold">
                                Creating...
                                <LoaderPinwheel className="animate-spin h-6 w-6" />
                            </span>
                        ) : (
                            <span className="flex items-center gap-2 text-white font-semibold">
                                Create Board
                                <SquareKanban />
                            </span>
                        )}
                    </Button>
                    {error && <p className="text-red-500">Error:{error.message}</p>}
                </div>
            </div>
        </Fragment>
    )
}

export default CreateBoard