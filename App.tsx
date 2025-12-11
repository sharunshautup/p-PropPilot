import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import BuilderPage from './pages/BuilderPage';
import DashboardPage from './pages/DashboardPage';
import AboutPage from './pages/AboutPage';
import AuthPage from './pages/AuthPage';

const App: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<LandingPage />} />
          <Route path="auth" element={<AuthPage />} />
          <Route path="builder" element={<BuilderPage />} />
          <Route path="plan/:id" element={<BuilderPage />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </HashRouter>
  );
};

export default App;