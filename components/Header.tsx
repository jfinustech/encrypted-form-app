
import React from 'react';

const LockIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
);


export const Header: React.FC = () => {
  return (
    <header className="bg-card shadow-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <LockIcon />
          <h1 className="text-2xl font-bold text-gray-800">Secure E2EE Form</h1>
        </div>
        <p className="text-text-secondary hidden sm:block">Client-Side Encryption Demo</p>
      </div>
    </header>
  );
};
