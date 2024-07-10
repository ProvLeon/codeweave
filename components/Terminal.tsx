// components/Terminal.tsx
"use client";

export default function Terminal() {
  return (
      <div className=" text-white bg-neutral-800 -mt-0.5 opacity-75 p-4 h-[190px] flex flex-col overflow-y-auto rounded-b-lg">
      <div className=" self-center bg-transparent opacity-80 text-xs -mt-2">
        Terminal
      </div>
      <hr className="  text-gray-500 mr-0" />
      <div className="bg-neutral-900 bg-opacity-50 h-[150px] p-2 rounded-b-lg">
        <p className="text-gray-100 text-sm">Terminal content here...</p>
      </div>
      </div>
  );
}
