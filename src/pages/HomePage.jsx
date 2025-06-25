import React from 'react';
import MainLayout from '../layouts/MainLayout';
import HeroSection from '../components/HeroSection';
import WhyChooseUs from '../components/WhyChooseUs';
import Categories from '../components/Categories';
import FeaturedProducts from '../components/FeaturedProducts';
import CallToActionSection from '../components/CallToActionSection';
import Footer from '../components/Footer';

const NavigationContext = React.createContext();

const HomePage = () => {
  return (
    <MainLayout>
      <HeroSection />
      <WhyChooseUs />
      <Categories />
      <FeaturedProducts />
      <CallToActionSection />
      <Footer/>
    </MainLayout>
  );
};

export default HomePage;