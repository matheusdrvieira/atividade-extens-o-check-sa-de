
import React from 'react';
import Header from '@/components/Header';
import AssessmentForm from '@/components/AssessmentForm';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 to-green-50">
      <div className="flex-1 py-6 md:py-12">
        <Header />
        <main className="mt-8">
          <AssessmentForm />
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default Index;
