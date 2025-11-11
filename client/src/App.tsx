import { Route, Routes } from 'react-router-dom';

import { Builder } from './pages/Builder';
import { Landing } from './pages/Landing';

export default function App() {
  return (
    <div className="min-h-screen bg-background text-[#E5E7EB]">
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/build" element={<Builder />} />
      </Routes>
    </div>
  );
}

