import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { FacilityPage } from './pages/FacilityPage';
import { FacilityDashboard } from './pages/FacilityDashboard';
import { SearchResultsPage } from './pages/SearchResultsPage';
import { ProtectedDashboard } from './components/ProtectedDashboard';

export function AppRoutes() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/search" element={<SearchResultsPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedDashboard>
              <FacilityDashboard />
            </ProtectedDashboard>
          }
        />
        <Route
          path="/facility/:id"
          element={
            <ProtectedDashboard>
              <FacilityPage />
            </ProtectedDashboard>
          }
        />
      </Routes>
    </div>
  );
}