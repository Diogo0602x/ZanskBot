import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const LandingPage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow flex items-center justify-center">
        <h1 className="text-4xl">Bem Vindo ao Zanskbot</h1>
      </main>
      <Footer />
    </div>
  );
}

export default LandingPage;
