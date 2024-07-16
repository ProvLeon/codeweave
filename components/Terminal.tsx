// components/Terminal.tsx
"use client";

export default function Terminal({executionResult}: {executionResult: string}) {
  return (
      <div className=" dark:bg-neutral-900 dark:bg-opacity-65 bg-gray-950 bg-opacity-85 text-white -mt-0.5  p-4 h-[190px] flex flex-col overflow-y-auto rounded-b-lg">
      <div className=" self-center bg-transparent opacity-80 text-xs -mt-2">
        Terminal
      </div>
      <hr className="  text-gray-500 mr-0" />
      <div className="bg-neutral-900 bg-opacity-50 h-[150px] p-2 rounded-b-lg">
        {executionResult ? <p className="text-gray-100 text-sm">{executionResult}</p> : <p className="text-gray-100 text-sm">Terminal content here...</p>}
      </div>
      </div>
  );
}
