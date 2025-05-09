import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const ToastComponent = () => {
    return (
        <ToastContainer position="top-center" theme="dark" autoClose={5000} />)
}

export default ToastComponent