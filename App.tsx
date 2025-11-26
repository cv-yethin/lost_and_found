import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import PostItem from './pages/PostItem';
import ItemDetail from './pages/ItemDetail';
import Auth from './pages/Auth';
import Profile from './pages/Profile';
import { StorageService } from './services/storage';
import { User } from './types';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const currentUser = StorageService.getCurrentUser();
    setUser(currentUser);
    setLoading(false);
  }, []);

  if (loading) return null;

  return (
    <Router>
      <Layout user={user} setUser={setUser}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/post" element={<PostItem user={user} />} />
          <Route path="/item/:id" element={<ItemDetail user={user} />} />
          <Route path="/login" element={user ? <Navigate to="/" /> : <Auth setUser={setUser} />} />
          <Route path="/profile" element={user ? <Profile user={user} /> : <Navigate to="/login" />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;