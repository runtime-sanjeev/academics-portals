import { createBrowserRouter } from 'react-router-dom';
import Login from './views/login';
import Dashboard from './views/dashboard';
import DefaultLayout from './components/DefaultLayout';
import GuestLayouts from './components/GuestLayouts';

const router = createBrowserRouter([
    {
        path: '/',
        element: <DefaultLayout />,
        children: [
            {
                path: '/dashboard',
                element: <Dashboard />
                },
        ]      
    },
    {
        path: '/',
        element: <GuestLayouts />,
        children: [
            {
                path: '/login',
                element: <Login />
            }
        ]        
    },
]);

export default router;
