import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useSearchParams } from 'react-router-dom';
import Layout from './components/Layout';
import NotFound from './components/NotFound';
import LockScreen from './components/LockScreen';
import InstallPrompt from './components/InstallPrompt';
import ViewOnlyLogin from './pages/ViewOnlyLogin';
import { useStore } from './store/useStore';

import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Analytics from './pages/Analytics';
import Reports from './pages/Reports';
import Accountability from './pages/Accountability';
import Settings from './pages/Settings';

// Component to handle shareable links
function ShareLinkHandler() {
  const [searchParams] = useSearchParams();
  const { isViewOnlyMode } = useStore();
  
  const shareCode = searchParams.get('shareCode');
  
  // If there's a share code in the URL and we're not in view-only mode yet, redirect to login
  if (shareCode && !isViewOnlyMode) {
    return <Navigate to={`/view-only-login?code=${shareCode}`} replace />;
  }
  
  return <Navigate to="/dashboard" replace />;
}

export default function App() {
  const { settings, sessionToken, lockVault, isViewOnlyMode } = useStore();
  const [searchParams] = useSearchParams();
  
  const shareCode = searchParams.get('shareCode');

  // 1. Dark Mode Toggle
  useEffect(() => {
    const isDark = settings.theme === 'dark' || (settings.theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.theme]);

  // 2. Inactivity Auto-Lock Security Listener
  useEffect(() => {
    if (!settings.pinEnabled || !sessionToken || isViewOnlyMode) return;

    let inactivityTimeout: any;

    const resetTimer = () => {
      clearTimeout(inactivityTimeout);
      const timeoutMs = (settings.sessionTimeoutMinutes || 5) * 60 * 1000;
      inactivityTimeout = setTimeout(() => {
        lockVault();
      }, timeoutMs);
    };

    const events = ['mousemove', 'mousedown', 'keypress', 'scroll', 'touchstart'];
    events.forEach(event => {
      window.addEventListener(event, resetTimer);
    });

    resetTimer();

    return () => {
      clearTimeout(inactivityTimeout);
      events.forEach(event => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, [settings.pinEnabled, sessionToken, settings.sessionTimeoutMinutes, lockVault, isViewOnlyMode]);

  // 3. Security Guard Intercept rendering
  if (settings.pinEnabled && !sessionToken && !isViewOnlyMode) {
    return <LockScreen />;
  }

  return (
    <BrowserRouter>
      <InstallPrompt />
      <Routes>
        <Route path="/view-only-login" element={<ViewOnlyLogin />} />
        <Route path="/" element={shareCode && !isViewOnlyMode ? <ShareLinkHandler /> : <Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="transactions" element={<Transactions />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="reports" element={<Reports />} />
          <Route path="accountability" element={<Accountability />} />
          <Route path="settings" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
