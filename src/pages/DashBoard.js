import React, { useEffect, useState } from 'react';
import Layout from '../components/shared/Layout';
import MainDashboard from '../components/MainDashboard';
import JimAdminDashboard from '../components/JimAdminDashboard';
import UserDashBoard from '../components/UserDashBoard';

const Dashboard = () => {
  const [role, setRole] = useState('');
  useEffect(() => {
    const storedRole = localStorage.getItem('role');
    if (storedRole) {
      setRole(storedRole);
    }
  }, []);
  console.log("rolerolerolerolerolerole",role)

  const renderDashboard = () => {
    switch (role) {
      case 'admin':
        return <MainDashboard />;
      case 'jimAdmin':
        return <JimAdminDashboard />;
      case 'user':
        return <UserDashBoard />;
      default:
        return <div>Loading...</div>;
    }
  };

  return (
    <>
        {role ? (
          renderDashboard()
        ) : (
          <div>Please log in to view this page.</div>
        )}
    </>
  );
};

export default Dashboard;
