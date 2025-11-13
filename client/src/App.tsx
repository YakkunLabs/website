import { Route, Routes } from 'react-router-dom';

import { ErrorBoundary } from './components/ErrorBoundary';
import { CreatorBilling } from './pages/creator/CreatorBilling';
import { CreatorDashboard } from './pages/creator/CreatorDashboard';
import { CreatorDetail } from './pages/creator/CreatorDetail';
import { CreatorLogin } from './pages/creator/CreatorLogin';
import { CreatorProtectedRoute } from './pages/creator/CreatorProtectedRoute';
import { Builder } from './pages/Builder';
import { Landing } from './pages/Landing';

export default function App() {
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-background text-[#E5E7EB]">
        <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/creator/login" element={<CreatorLogin defaultMode="login" />} />
        <Route path="/creator/signup" element={<CreatorLogin defaultMode="register" />} />
        <Route element={<CreatorProtectedRoute />}>
          <Route path="/build" element={<Builder />} />
          <Route path="/creator" element={<CreatorDashboard />} />
          <Route path="/creator/dashboard" element={<CreatorDashboard />} />
          <Route path="/creator/billing" element={<CreatorBilling />} />
          <Route path="/creator/:id" element={<CreatorDetail />} />
        </Route>
        </Routes>
      </div>
    </ErrorBoundary>
  );
}

