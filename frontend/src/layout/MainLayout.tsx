import { Outlet } from 'react-router-dom';
import Navigation from '../components/Navigation';

export default function MainLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navigation />
      <main className="flex flex-1 items-center justify-center p-4">
        <Outlet />
      </main>
    </div>
  );
}
