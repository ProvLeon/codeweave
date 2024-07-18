"use client"
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { solarizedlight } from 'react-syntax-highlighter/dist/cjs/styles/prism';

const Intro = () => {
  const fullCodeString = `function collaborativeEditing() {
  const editor = new CodeEditor();
  editor.enableRealTimeCollaboration();
  editor.on('change', (content) => {
    saveDocument(content);
  });
}

function saveDocument(content) {
  fetch('/api/save', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ content }),
  });
}
  `;

  const [codeString, setCodeString] = useState('');

  useEffect(() => {
    let currentIndex = 0;
    const intervalId = setInterval(() => {
      setCodeString((prev) => prev + fullCodeString[currentIndex]);
      currentIndex += 1;
      if (currentIndex === fullCodeString.length) {
        clearInterval(intervalId);
      }
    }, 50); // Adjust the typing speed by changing the interval (milliseconds)

    return () => clearInterval(intervalId);
  }, []); // Removed mouseX from dependency array

  return (
    <div className="mx-auto gap-2 px-4 py-16 text-center bg-gradient-to-br from-blue-50 to-green-50 dark:from-slate-600 dark:to-slate-700 shadow-lg overflow-hidden h-[70vh] flex">
      <div className="w-2/3 flex flex-col justify-center items-center">
        <h1 className="flex text-5xl font-bold mb-6 text-light-heading dark:text-dark-heading">Welcome to Code<p className='text-active'>
          Weave
          </p>
        </h1>
        <p className="text-2xl mb-8 text-light-text dark:text-dark-text">
          Real-time collaborative code editing and execution across multiple programming languages.
        </p>
        <div className="space-x-4">
          <Link href="/sign-up">
            <Button size="lg">Get Started</Button>
          </Link>
          <Link href="/sign-in">
            <Button size="lg" variant="outline">Login</Button>
          </Link>
        </div>
      </div>
      <div className="w-1/3 relative flex items-center justify-center overflow-hidden">
        <div className="text-xs p-4 rounded-lg bg-dark-bg dark:bg-dark-bg-secondary">
          <SyntaxHighlighter
            language="javascript"
            style={solarizedlight}
            customStyle={{ backgroundColor: 'transparent' }}
          >
            {codeString}
          </SyntaxHighlighter>
        </div>
      </div>
    </div>
  );
};

export default Intro;
