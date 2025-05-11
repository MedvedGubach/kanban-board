import { Fragment, useState } from 'react';
import { useMutation } from '@apollo/client';
import { CREATE_SUB_TASK } from '../graphql/mutations/subTask';
import { GET_SUBTASKS } from '../graphql/queries/getSubTasks';
import { Input, Select, Button } from '@headlessui/react';
import { toast } from 'react-toastify';
import { LoaderPinwheel } from 'lucide-react';
import { CreateSubTaskInterface } from '../interfaces/tsInterfaces';

const CreateSubTasks = ({ taskId }: { taskId: string }) => {

    const [form, setForm] = useState<CreateSubTaskInterface>({
        title: "",
        subTask: "",
        priority: "Low",
        dueDate: "",
        subTaskStatus: "Pending",
    });

    const [createSubTaskMutation, { loading }] = useMutation(CREATE_SUB_TASK);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm(prev => ({ ...prev, dueDate: e.target.value }));
    };



    const handleCreateSubTask = async () => {

        const userId = sessionStorage.getItem("userId");
        if (!userId) { toast.error("User not logged in"); return; }
        if (form.title === "" || form.subTask === "") { toast.warning("You must fill all fields", { toastId: 'sub-task-empty-fields' }); return; }

        try {
            /* const { data } =  */await createSubTaskMutation({
            variables: {
                title: form.title,
                subTask: form.subTask,
                priority: form.priority,
                subTaskStatus: form.subTaskStatus,
                dueDate: form.dueDate,
                taskId: taskId,
                createdBy: userId
            },
            refetchQueries: [{ query: GET_SUBTASKS, variables: { taskId } }]
        });
            //setForm({ title: "", subTask: "", priority: "Low", dueDate: "", subTaskStatus: "Pending" })
            toast.success("Sub-Task created successfully", { toastId: 'sub-task' })
        } catch (error) {
            console.log(error)
            toast.error("Something went wrong:", { toastId: 'server-error' })
        }
    }

    return (
        <Fragment>
            <div className="container mx-auto w-full mb-6">
                <div className="space-x-4 justify-between flex">
                    <Input value={form.title} name="title" placeholder="Sub-Task Title" onChange={handleChange} className="w-full h-12 bg-neutral-100 text-black rounded-lg" />
                    <Input value={form.subTask} name="subTask" placeholder="Sub-Task" onChange={handleChange} className="w-full h-12 bg-neutral-100 text-black rounded-lg" />
                    <Select onChange={handleChange} name="priority" aria-label="Priority Select" className="w-full h-12 bg-neutral-100 text-black rounded-lg">
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                    </Select>

                    <input
                        type="date"
                        name="dueDate"
                        placeholder='Due Date Select'
                        value={form.dueDate}
                        onChange={handleDateChange}
                        className="h-12 bg-neutral-100 text-black rounded-lg w-full"
                    />

                    <Button onClick={handleCreateSubTask} disabled={loading} className="w-full rounded-xl bg-sky-600 px-4 py-2 text-sm text-white data-active:bg-sky-700 data-hover:bg-sky-500 hover:cursor-pointer">
                        {loading ? (
                            <span className="flex items-center gap-2 text-white font-semibold">
                                Creating...
                                <LoaderPinwheel className="animate-spin h-6 w-6" />
                            </span>
                        ) : (
                            <span className="flex items-center gap-2 text-white font-semibold">Create Sub-Task</span>
                        )}
                    </Button>
                </div>
            </div>
        </Fragment>
    );
}

export default CreateSubTasks;
