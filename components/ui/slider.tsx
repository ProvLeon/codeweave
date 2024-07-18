"use client"
import React, { useEffect, useRef, useState } from 'react';

interface SliderProps {
  children: React.ReactNode;
  autoPlay?: boolean;
  autoPlaySpeed?: number;
}

const Slider: React.FC<SliderProps> = ({ children, autoPlay = true, autoPlaySpeed = 3000 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);
  const totalSlides = React.Children.count(children);
  const slidesToShow = 3;

  useEffect(() => {
    if (autoPlay && totalSlides > slidesToShow) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % Math.ceil(totalSlides / slidesToShow));
      }, autoPlaySpeed);
      return () => clearInterval(interval);
    }
  }, [autoPlay, autoPlaySpeed, totalSlides]);

  useEffect(() => {
    if (sliderRef.current && totalSlides > slidesToShow) {
      sliderRef.current.style.transform = `translateX(-${currentIndex * (100 / slidesToShow)}%)`;
    }
  }, [currentIndex, totalSlides]);

  return (
    <div className="overflow-hidden relative">
      <div ref={sliderRef} className={`flex transition-transform duration-500 ease-in-out ${totalSlides <= slidesToShow ? 'justify-center' : ''}`} style={{ width: `${totalSlides * (100 / slidesToShow)}%` }}>
        {React.Children.map(children, (child, index) => (
          <div className="w-1/3 flex-shrink-0">
            {child}
          </div>
        ))}
      </div>
      {totalSlides > slidesToShow && (
        <div className="absolute bottom-0 left-0 right-0 flex justify-center p-2">
          {Array.from({ length: Math.ceil(totalSlides / slidesToShow) }).map((_, index) => (
            <button
              key={index}
              className={`h-2 w-2 rounded-full mx-1 ${index === currentIndex ? 'bg-blue-500' : 'bg-gray-300'}`}
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Slider;
