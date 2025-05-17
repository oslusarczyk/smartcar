import { Routes, Route } from 'react-router-dom';
import MainLayout from './layout/MainLayout';
import About from './pages/About';
import Contact from './pages/Contact';
import Auth from './pages/Auth';
import Main from './pages/Main';

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Main />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/auth" element={<Auth />} />
      </Route>
    </Routes>
  );
}

export default App;
