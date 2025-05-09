import { Fragment } from "react";
import { ApolloProvider } from '@apollo/client';
import client from "./graphql/apolloClient";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Navbar from "./components/Navbar";
import Tasks from "./pages/Tasks";
import PrivateRoute from "./components/PrivateRoute";
import ToastComponent from "./components/ToastComponent";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';

function App() {
  return (
    <ApolloProvider client={client}>
      <Fragment>
        <BrowserRouter>
          <div className="fixed top-0 -z-10 h-full w-full">
            <div className="absolute top-0 left-0 h-full w-full bg-neutral-950" />
            <div className="absolute top-0 left-0 h-full w-full bg-[radial-gradient(ellipse_70%_70%_at_50%_30%,rgba(80,80,200,0.15),transparent)]" />
            <div className="absolute bottom-0 right-0 h-1/2 w-1/2 bg-[radial-gradient(ellipse_50%_50%_at_80%_80%,rgba(255,0,150,0.05),transparent)]" />
          </div>
          <div className="max-w-screen-xl mx-auto px-4 sm:px-6 md:px-8 overflow-x-hidden">
            <Routes>
              <Route path='/' element={<Login />} />
              <Route path='/Register' element={<Register />} />
              <Route path="/Dashboard" element={(<PrivateRoute><><Navbar /><Dashboard /></></PrivateRoute>)} />
              <Route path="/Tasks" element={(<PrivateRoute><><Navbar /><Tasks /></></PrivateRoute>)} />
            </Routes>
            <ToastComponent />
          </div>

        </BrowserRouter>
      </Fragment>
    </ApolloProvider>
  )
}

export default App
