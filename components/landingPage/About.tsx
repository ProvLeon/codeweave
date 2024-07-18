import Image from 'next/image';
import React from 'react';
import { LinkedIn, Instagram, WhatsApp, GitHub, X } from '@mui/icons-material';
import Contact from './Contact';


const About = () => {
  return (
    <div className="about-section py-20 bg-gradient-to-br from-blue-50 to-green-50 dark:from-slate-600 dark:to-slate-700 text-center shadow-lg rounded-lg">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 flex justify-center mb-8 md:mb-0">
          <Contact/>
        </div>
        <div className="md:w-1/2 text-left md:pl-8">
          <h2 className="flex text-5xl font-extrabold mb-8 text-light-heading dark:text-dark-heading">About Us
          <Image src="/assets/icons8-about-420.svg" alt="Team Collaboration" className=" rounded-lg " width={50} height={50} />
          </h2>
          <p className="text-xl text-gray-700 dark:text-gray-300 leading-8 mb-12">
            CodeWeave is a real-time collaborative code editing platform that supports multiple programming languages. Our mission is to make coding more interactive and productive for teams around the world.
          </p>
          <div className="w-full max-w-4xl px-4 flex flex-col justify-center items-center mt-8">
        <p className="text-xl mb-4 text-light-text dark:text-dark-text">
          Connect with us on social media:
        </p>
        <div className="flex space-x-4">
          <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer">
            <LinkedIn className="w-8 h-8 text-blue-700 hover:text-blue-800 transition duration-300" />
          </a>
          <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
            <Instagram className="w-8 h-8 text-pink-500 hover:text-pink-600 transition duration-300" />
          </a>
          <a href="https://www.whatsapp.com" target="_blank" rel="noopener noreferrer">
            <WhatsApp className="w-8 h-8 text-green-500 hover:text-green-600 transition duration-300" />
          </a>
          <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer">
            <X className="w-8 h-8 text-gray-700 hover:text-gray-800 transition duration-300" />
          </a>
          <a href="https://www.github.com" target="_blank" rel="noopener noreferrer">
            <GitHub className="w-8 h-8 text-black hover:text-gray-800 transition duration-300" />
          </a>
        </div>
      </div>
        </div>
      </div>
    </div>
  );
};

export default About;
