import { Fragment, useState } from 'react'
import { useLocation } from 'react-router-dom'
import CreateTask from '../components/CreateTask';
import ConfirmationDialog from '../components/ConfirmationDialog';
import SubTaskDetails from '../components/SubTaskDetails';
import { useQuery } from '@apollo/client';
import { GET_TASKS } from '../graphql/queries/getTasks';
import { useMutation } from '@apollo/client';
import { UPDATE_TASK_STATUS } from '../graphql/mutations/updateTaskStatus';
import { DELETE_TASK } from '../graphql/mutations/deleteTask';
import { motion } from "framer-motion";
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { GetTaskInterface } from '../interfaces/tsInterfaces';
import { Button } from '@headlessui/react'
import { toast } from 'react-toastify';
import { Reference } from "@apollo/client";

const Tasks = () => {

    const [dialogDetailsOpen, setDialogDetails] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedTaskId, setSelectedTaskId] = useState<string | ''>('');
    const [selectedTaskName, setSelectedTaskName] = useState('');
    const location = useLocation();
    const item = location.state;
    const { data, loading, /* error */ } = useQuery(GET_TASKS, { variables: { board: item.id } });

    const [updateTaskStatus] = useMutation(UPDATE_TASK_STATUS);
    const [deleteTask] = useMutation(DELETE_TASK);
    if (loading) return <div className="text-white text-center">Loading...</div>;
    /* if (error) return <div className="text-red-500 text-center">Error: {error.message}</div>; */


    const handleOpenDetails = (taskId: string) => {
        setSelectedTaskId(taskId);
        setDialogDetails(true);
    }

    const handleDelete = (taskId: string, taskName: string) => {
        setSelectedTaskId(taskId);
        setSelectedTaskName(taskName);
        setDeleteDialogOpen(true);
    }

    const handleConfirmDelete = async (taskId: string) => {
        try {
            await deleteTask({
                variables: { taskId },
                update(cache, { data }) {
                    if (data?.deleteTask) {
                        cache.modify({
                            fields: {
                                getTasks(existingTasksRef = [], { readField }) {
                                    return existingTasksRef.filter(
                                        (taskRef: Reference) => readField("id", taskRef) !== taskId
                                    );
                                }
                            }
                        });
                    }
                }
            });

            toast.success("Task deleted successfully", { toastId: "task-deleted" });
            setDeleteDialogOpen(false);
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong", { toastId: "error-deleted" });
            setDeleteDialogOpen(false);
        }
    }

    /* Dnd functions */
    const onDragEnd = async (result: DropResult) => {
        const { destination, source, draggableId } = result
        if (!destination) return;
        const sourceStatus = source.droppableId;
        const destinationStatus = destination.droppableId;

        /* Update only if status changed */
        if (sourceStatus !== destinationStatus) {
            try {
                await updateTaskStatus({
                    variables: { id: draggableId, status: destinationStatus },
                    refetchQueries: [{ query: GET_TASKS, variables: { board: item.id } }]
                })
            } catch (error) {
                console.error("Error updating status", error);
            }
        }
    };

    const columns = [
        { id: 'Pending', title: 'Pending', color: 'bg-blue-600', delay: 0.1 },
        { id: 'In progress', title: 'In Progress', color: 'bg-orange-400', delay: 0.2 },
        { id: 'Complete', title: 'Complete', color: 'bg-green-600', delay: 0.3 },
    ]

    return (
        <Fragment>
            <div className="container mx-auto py-6 px-4 text-center bg-neutral-900">
                <div className="py-2 sm:flex-wrap flex sm:flex-row items-center justify-between bg-neutral-900 bg-opacity-50 rounded-2xl">
                    <CreateTask board={item.id} />
                </div>

                <DragDropContext onDragEnd={onDragEnd}>
                    <div className="grid  sm:grid-cols-1 md:grid-cols-3 xl:grid-cols-3 gap-6 font-bold mt-6">
                        {columns.map((col) => (
                            <Droppable droppableId={col.id} key={col.id}>
                                {(provided) => (
                                    <motion.div
                                        ref={provided.innerRef}
                                        {...provided.droppableProps}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 0.3, delay: col.delay }}
                                        className={`${col.color} text-white rounded-t-xl p-4 min-h-[400px]`}
                                    >
                                        <h1 className="mb-4">{col.title}</h1>

                                        {data?.getTasks
                                            .filter((task: GetTaskInterface) => task.status === col.id)
                                            .map((task: GetTaskInterface, index: number) => (
                                                <Draggable draggableId={task.id} index={index} key={task.id}>
                                                    {(provided) => (
                                                        <Fragment>
                                                            <div
                                                                ref={provided.innerRef}
                                                                {...provided.draggableProps}
                                                                {...provided.dragHandleProps}
                                                                className="bg-yellow-100 text-black p-2 mb-2 rounded shadow"
                                                            >
                                                                <div className="">
                                                                    <p className="font-bold">{task.title}</p>
                                                                    <p className="font-semibold">{task.description}</p>
                                                                </div>

                                                                <div className="w-full grid grid-cols-2 space-x-2 mt-6">
                                                                    <Button
                                                                        onClick={() => handleOpenDetails(task.id)}
                                                                        className="rounded bg-sky-500 px-4 py-2 text-sm text-white hover:cursor-pointer hover:bg-sky-600">
                                                                        Task Details
                                                                    </Button>
                                                                    <Button onClick={() => handleDelete(task.id, task.title)} className="rounded bg-red-500 px-4 py-2 text-sm text-white hover:cursor-pointer hover:bg-red-600">
                                                                        Delete Task
                                                                    </Button>
                                                                </div>
                                                            </div>


                                                        </Fragment>
                                                    )}
                                                </Draggable>
                                            ))}
                                        {provided.placeholder}
                                    </motion.div>
                                )}
                            </Droppable>
                        ))}
                    </div>
                </DragDropContext>
            </div>

            <SubTaskDetails
                title='Sub-Task Details'
                taskId={selectedTaskId}
                open={dialogDetailsOpen}
                onClose={() => setDialogDetails(false)}
            />

            <ConfirmationDialog
                title='Delete Task'
                description={<>
                    Are you sure you want to delete the task: <strong className="text-white">{selectedTaskName}?</strong> All related sub-tasks will be deleted too.
                </>}
                open={deleteDialogOpen}
                action='Delete Task'
                onClose={() => setDeleteDialogOpen(false)}
                onConfirm={() => selectedTaskId && handleConfirmDelete(selectedTaskId)}
            />
        </Fragment>
    )
}

export default Tasks;