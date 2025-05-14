import { Outlet } from 'react-router-dom';
import Navigation from '../components/Navigation';

export default function MainLayout() {
  return (
    <div>
      <Navigation />
      <main className="p-4">
        <Outlet />
      </main>
    </div>
  );
}
