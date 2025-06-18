import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const NavigationContext = React.createContext();
const MainLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;