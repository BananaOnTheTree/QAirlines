import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Homepage from './pages/Homepage.jsx';
import MyFlight from './pages/MyFlight.jsx';
import Admin from './admin/Admin.jsx';
import AdminLogin from './admin/AdminLogin.jsx';
import UserLogin from './pages/UserLogin.jsx';
import SignUp from './pages/SignUp.jsx';
import './index.css';
import Search from './pages/Search.jsx';
import Booking from './pages/Booking.jsx';
import ProtectedRoute from './admin/ProtectedRoute.jsx';

const router = createBrowserRouter([
    {
        path: '/',
        element: <Homepage />,
    },
    {
        path: '/search',
        element: <Search />,
    },
    {
        path: '/booking',
        element: <Booking />,
    },
    {
        path: '/admin',
        element: (
            <ProtectedRoute role="admin">
                <Admin />
            </ProtectedRoute>
        ),
    },
    {
        path: '/adminLogin',
        element: <AdminLogin />,
    },
    {
        path: '/login',
        element: <UserLogin />,
    },
    {
        path: '/signup',
        element: <SignUp />,
    },
    {
        path: '/myflight',
        element: <MyFlight />,
    },
]);

createRoot(document.getElementById('root')).render(
    <div>
        <div className="z-0 fixed top-0 left-0 bottom-0 right-0 bg-[#F5F5F5]"/>
        <RouterProvider router={router}/>
    </div>
);