import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { useAuth } from './hooks/useAuth';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import AddSnippet from './pages/AddSnippet';
import ViewSnippet from './pages/ViewSnippet';
import EditSnippet from './pages/EditSnippet';

import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import ClickBurst from './components/ClickBurst';

import Chatbot from './components/Chatbot';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center text-primary-500">Loading...</div>;
  return user ? children : <Navigate to="/login" />;
};

const AppLayout = ({ children }) => {
  return (
    <div className="flex h-screen overflow-hidden transition-colors duration-500 bg-background text-foreground">
      <ClickBurst />
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6 relative">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
      <Chatbot />
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              
              <Route path="/dashboard" element={<PrivateRoute><AppLayout><Dashboard /></AppLayout></PrivateRoute>} />
              <Route path="/admin" element={<PrivateRoute><AppLayout><AdminDashboard /></AppLayout></PrivateRoute>} />
              <Route path="/snippet/new" element={<PrivateRoute><AppLayout><AddSnippet /></AppLayout></PrivateRoute>} />
              <Route path="/snippet/:id" element={<PrivateRoute><AppLayout><ViewSnippet /></AppLayout></PrivateRoute>} />
              <Route path="/snippet/edit/:id" element={<PrivateRoute><AppLayout><EditSnippet /></AppLayout></PrivateRoute>} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </Router>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
