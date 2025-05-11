export interface LoginFormInterface {
    email: string,
    password: string,
}

export interface RegisterFormInterface {
    user_name: string,
    email: string,
    password: string,
    confirm_password: string,
}

export interface GetBoardsInterface {
    id: string,
    title: string,
    description: string,
    createdBy: string
}

export interface GetTaskInterface {
    id: string,
    board: string,
    title: string,
    description: string,
    status: string,
    createdBy: string,
}

export interface GetSubTasksInterface {
    id: string,
    title: string,
    subTask: string,
    subTaskStatus: string,
    priority: string,
    dueDate: string,
    createdBy: string,
    taskId: string,
}

export interface ConfirmationDialogInterface {
    title: string,
    description: React.ReactNode,
    open: boolean,
    action: string,
    onClose: () => void,
    onConfirm: () => void

}

export interface CreateSubTaskInterface {
    title: string;
    subTask: string;
    priority: "Low" | "Medium" | "High";
    dueDate: string;
    subTaskStatus: "Pending" | "Complete";
}