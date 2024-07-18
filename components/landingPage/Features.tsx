import React from 'react';
import Slider from '@/components/ui/slider';
import Image from 'next/image';

const features = [
  {
    title: "Real-time Collaboration",
    description: "Collaborate with your team in real-time, making coding sessions more interactive and productive.",
    image: "/assets/collaboration-svgrepo-com (1).svg",
    isVideo: false
  },
  {
    title: "Multi-language Support",
    description: "Write and execute code in multiple programming languages seamlessly within the same environment.",
    image: "/assets/code-svgrepo-com (1).svg",
    image2: "/assets/code-svgrepo-com.svg",
    isVideo: false
  },
  {
    title: "Version Control",
    description: "Keep track of changes with integrated version control, ensuring you never lose your progress.",
    image: "/assets/git-opened-svgrepo-com.svg",
    isVideo: false
  },
];

const Features = () => {
  return (
    <div className="py-16 bg-gradient-to-br from-blue-50 to-green-50 dark:from-slate-600 dark:to-slate-700 inset-1/2 shadow-lg overflow-hidden border-2 border-light-border dark:border-dark-border">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12 text-light-heading dark:text-dark-heading">Features</h2>
        <Slider autoPlay autoPlaySpeed={3000}>
          {features.map((feature, index) => (
            <div key={index} className="px-2">
              <div className="flex flex-col bg-white dark:bg-slate-800 rounded-lg shadow-lg overflow-hidden">
                {feature.isVideo ? (
                  <video className="w-full h-48 object-cover" controls>
                    <source src={feature.image} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <Image src={feature.image} alt={feature.title} className="self-center w-50 h-50 object-cover" width={200} height={200} />
                )}
                <div className="p-6">
                  <h3 className="text-2xl font-bold mb-2 text-light-heading dark:text-dark-heading">{feature.title}</h3>
                  <p className="text-light-text dark:text-dark-text">{feature.description}</p>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default Features;
