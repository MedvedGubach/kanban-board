import { JSX } from "react";
import { Navigate } from "react-router-dom";

interface Props {
    children: JSX.Element;
}

const PrivateRoute = ({ children }: Props) => {
    const token = sessionStorage.getItem("token");
    if (!token) {
        return <Navigate to="/" replace />
    }

    return children;
};

export default PrivateRoute