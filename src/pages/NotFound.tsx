import React from 'react';
import { Button } from '../components/Button';

export const NotFound: React.FC = () => {
  return (
    <div className="max-w-container mx-auto px-4 sm:px-6 py-20 md:py-32 text-center">
      <div className="border border-north-black bg-white p-12 md:p-24 space-y-6">
        <span className="font-heading font-extrabold text-7xl sm:text-9xl text-north-black leading-none block tracking-tighter">
          404
        </span>
        <h1 className="font-heading text-3xl sm:text-5xl font-bold uppercase tracking-tight text-north-black">
          Sorry, Page Not Found!
        </h1>
        <p className="text-north-gray max-w-md mx-auto text-base">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <div className="pt-6">
          <Button to="/">RETURN TO HOMEPAGE</Button>
        </div>
      </div>
    </div>
  );
};
