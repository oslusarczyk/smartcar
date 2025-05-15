import { NavLink } from 'react-router-dom';
import { useState } from 'react';
import { LogOut, Menu, X } from 'lucide-react';
import SmartCarLogo from '../assets/smartcar_logo.png';
import { useAuth } from '../auth/AuthContext';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const { logout } = useAuth();
  const { isAuthenticated, isAdmin } = useAuth();

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `block flex gap-2  px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      isActive
        ? 'bg-green-500 text-white'
        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
    }`;

  const navLinks = (
    <>
      <NavLink to="/" className={linkClass} onClick={() => setIsOpen(false)}>
        Home
      </NavLink>
      <NavLink
        to="/about"
        className={linkClass}
        onClick={() => setIsOpen(false)}
      >
        About
      </NavLink>
      <NavLink
        to="/contact"
        className={linkClass}
        onClick={() => setIsOpen(false)}
      >
        Contact
      </NavLink>
      {isAuthenticated && (
        <NavLink
          to="/auth"
          className={linkClass}
          onClick={() => {
            setIsOpen(false);
            logout();
          }}
        >
          <LogOut size={20} />
          Wyloguj się
        </NavLink>
      )}
      {!isAuthenticated && (
        <NavLink
          to="/auth"
          className={linkClass}
          onClick={() => setIsOpen(false)}
        >
          Logowanie
        </NavLink>
      )}
      {/* {isAuthenticated && isAdmin && (
        <NavLink
          to="/admin"
          className={linkClass}
          onClick={() => setIsOpen(false)}
        >
          Admin
        </NavLink>
      )} */}
    </>
  );

  return (
    <nav className="bg-gray-800">
      <div className="max-w-9xl mx-auto px-2 sm:px-4 lg:px-6">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="text-xl font-bold text-white">SmartCar</div>
            <img
              className="h-12 w-12 object-contain"
              src={SmartCarLogo}
              alt="SmartCar logo"
            />
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-2xl text-gray-300 hover:text-white"
              aria-label="Toggle Menu"
            >
              {isOpen ? <X size={42} /> : <Menu size={42} />}
            </button>
          </div>

          <div className="hidden gap-x-3 md:flex">{navLinks}</div>
        </div>

        {isOpen && (
          <div className="mt-2 space-y-1 pb-2 md:hidden">{navLinks}</div>
        )}
      </div>
    </nav>
  );
}
