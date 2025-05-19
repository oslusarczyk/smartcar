import { Routes, Route } from 'react-router-dom';
import MainLayout from './layout/MainLayout';
import Auth from './pages/Auth';
import Main from './pages/Main';
import Cars from './pages/Cars';

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Main />} />
        <Route path="/cars" element={<Cars />} />
        <Route path="/auth" element={<Auth />} />
      </Route>
    </Routes>
  );
}

export default App;
