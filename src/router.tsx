
import { createBrowserRouter } from 'react-router-dom';
import Index from './pages/Index';
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import Cleaning from './pages/Cleaning';
import Maintenance from './pages/Maintenance';
import Calendar from './pages/Calendar';
import Properties from './pages/Properties';
import Billing from './pages/Billing';
import MoyenneDuree from './pages/MoyenneDuree';
import NotFound from './pages/NotFound';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Index />,
  },
  {
    path: '/dashboard',
    element: <Dashboard />,
  },
  {
    path: '/inventory',
    element: <Inventory />,
  },
  {
    path: '/cleaning',
    element: <Cleaning />,
  },
  {
    path: '/maintenance',
    element: <Maintenance />,
  },
  {
    path: '/calendar',
    element: <Calendar />,
  },
  {
    path: '/properties',
    element: <Properties />,
  },
  {
    path: '/billing',
    element: <Billing />,
  },
  {
    path: '/moyenne-duree',
    element: <MoyenneDuree />,
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);
