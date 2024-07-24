import React from 'react';
import Link from 'next/link';
//import Image from 'next/image';
import { Home, ErrorOutline } from '@mui/icons-material';
import { Button } from '@/components/ui/button';
//import { Button } from '@mui/material';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-green-50 dark:from-slate-600 dark:to-slate-700 text-center">
      <div className="container mx-auto px-4 py-20">
        <ErrorOutline style={{ fontSize: 150 }} className="text-red-500 mb-8" />
        <h1 className="text-6xl font-extrabold mb-4 text-light-heading dark:text-dark-heading">Page Not Found</h1>
        <p className="text-xl text-gray-700 dark:text-gray-300 mb-8">
          Oops! The page you are looking for does not exist. It might have been moved or deleted.
        </p>
        <Button className='py-3 text-lg font-semibold text-white rounded-lg shadow-md transition duration-300'>
        <Link href="/" className=" flex  ">
          <Home  />
          Go Back Home
        </Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFoundPage;
