import { Fragment, useState } from 'react'
import { useQuery, useMutation } from '@apollo/client';
import { GET_BOARDS } from '../graphql/queries/getBoards';
import { DELETE_BOARD } from '../graphql/mutations/deleteBoard';
import { GetBoardsInterface } from '../interfaces/tsInterfaces';
import CreateBoard from '../components/CreateBoard'
import { Button } from '@headlessui/react'
import { motion } from 'framer-motion';
import { Link } from "react-router-dom";
import { toast } from 'react-toastify';
import ConfirmationDialog from '../components/ConfirmationDialog';
import { Reference } from "@apollo/client";

const Dashboard = () => {

    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedBoardId, setSelectedBoardId] = useState<string | null>(null);
    const [deleteBoard] = useMutation(DELETE_BOARD);
    const { loading, error, data } = useQuery(GET_BOARDS, { fetchPolicy: 'network-only', })
    if (loading) return <div className="text-center py-10 font-bold">Loading boards...</div>;

    const handleDelete = (boardId: string) => { setSelectedBoardId(boardId); setDialogOpen(true); }

    const handleConfirmDelete = async (id: string) => {
        try {
            await deleteBoard({
                variables: { id },
                update(cache, { data }) {
                    if (data?.deleteBoard) {
                        cache.modify({
                            fields: {
                                getBoards(existingBoardsRefs = [], { readField }) {
                                    return existingBoardsRefs.filter(
                                        (boardRef: Reference) => readField("id", boardRef) !== id
                                    );
                                }
                            }
                        });
                    }
                }
            });

            toast.success("Board deleted successfully", { toastId: "board-deleted" });
            setDialogOpen(false);
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong", { toastId: "error-deleted" });
            setDialogOpen(false);
        }
    };


    return (
        <Fragment>
            <div className="container mx-auto py-6 px-4 text-center ">
                <div className="py-2 sm:flex-wrap flex sm:flex-row items-center justify-between bg-neutral-800 bg-opacity-25 rounded-t-2xl">
                    <CreateBoard></CreateBoard>
                </div>

                {error && (
                    <div className="text-center py-4 text-red-500 font-bold">
                        Failed to load boards. You can still create one.
                    </div>
                )}

                {!loading && !error && (!data || data.getBoards.length === 0) && (
                    <div className="col-span-full py-10 text-gray-400 font-semibold">
                        No boards yet... Create one!
                    </div>
                )}


                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 bg-neutral-900 bg-opacity-25 rounded-b-2xl">
                    {data?.getBoards?.map((board: GetBoardsInterface) => (
                        <motion.div
                            key={board.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.5 }}
                            className="bg-yellow-100 p-4 rounded-lg shadow hover:shadow-lg transition-all flex flex-col justify-between mt-6"
                        >

                            <div className="mb-4">
                                <h1 className="text-lg font-semibold text-black">{board.title}</h1>
                                <p className="text-sm text-gray-900">{board.description}</p>
                            </div>

                            <div className="w-full grid grid-cols-2 space-x-2 mt-6">
                                <Link to={`/Tasks`} state={{ id: board.id, title: board.title, description: board.description, createdBy: board.createdBy }}
                                    className="rounded bg-sky-500 px-4 py-2 text-sm text-white hover:cursor-pointer hover:bg-sky-600">
                                    Details
                                </Link>
                                <Button onClick={() => handleDelete(board.id)} className="rounded bg-red-500 px-4 py-2 text-sm text-white hover:cursor-pointer hover:bg-red-600">
                                    Delete Board
                                </Button>
                            </div>
                        </motion.div>
                    ))
                    }
                </div>
            </div>

            <ConfirmationDialog
                title='Delete Board'
                description='Are you sure you want to delete the board?'
                open={dialogOpen}
                action='Delete Board'
                onClose={() => setDialogOpen(false)}
                onConfirm={() => selectedBoardId && handleConfirmDelete(selectedBoardId)}
            />

        </Fragment>
    )
}

export default Dashboard