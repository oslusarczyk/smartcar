import MainLayout from './layout/MainLayout';
import Auth from './pages/Auth';
import Main from './pages/Main';
import Cars from './pages/Cars';
import CarDetails from './pages/CarDetails';
import Error from './pages/Error';
import History from './pages/History';
import { UnloggedRoute } from './pages/protectedRoutes/unloggedRoute';
import CarAdmin from './pages/CarAdmin';
import { LoggedRoute } from './pages/protectedRoutes/loggedRoute';
import { AdminRoute } from './pages/protectedRoutes/adminRoute';
import AddCar from './pages/addCar';

import { useRoutes, Outlet } from 'react-router-dom';

function AdminLayout() {
  return (
    <AdminRoute>
      <Outlet />
    </AdminRoute>
  );
}

const routes = [
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { path: '/', element: <Main /> },
      { path: 'cars', element: <Cars /> },
      { path: 'cars/:id', element: <CarDetails /> },
      {
        path: 'auth',
        element: (
          <UnloggedRoute>
            <Auth />
          </UnloggedRoute>
        ),
      },
      {
        path: 'history',
        element: (
          <LoggedRoute>
            <History />
          </LoggedRoute>
        ),
      },
      {
        path: 'admin',
        element: <AdminLayout />,
        children: [
          { path: 'reservation', element: <CarAdmin /> },
          { path: 'add', element: <AddCar /> },
        ],
      },
      { path: '*', element: <Error /> },
    ],
  },
];

function App() {
  const element = useRoutes(routes);
  return element;
}

export default App;
