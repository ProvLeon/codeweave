import { RefreshCwIcon } from "lucide-react";
import { useState } from "react";

interface TerminalProps {
  executionResult: string;
  isLoading: boolean;
}

export default function Terminal({ executionResult, isLoading }: TerminalProps) {
  const [content, setContent] = useState(executionResult);

  const handleRefresh = () => {
    setContent("Terminal content here...");
  };

  return (
    <div className="relative dark:bg-neutral-900 dark:bg-opacity-65 bg-gray-950 bg-opacity-85 text-white -mt-0.5 p-4 h-[190px] flex flex-col overflow-y-auto rounded-b-lg">
      <RefreshCwIcon className="absolute right-5 top-1 cursor-pointer" size={16} onClick={handleRefresh} />
      <div className="self-center bg-transparent opacity-80 text-xs -mt-2">
        Terminal
      </div>
      <hr className="text-gray-500 mr-0" />
      <div className="bg-neutral-900 bg-opacity-50 h-[150px] p-2 rounded-b-lg">
        {isLoading ? (
          <p className="text-gray-100 text-sm">Loading...</p>
        ) : (
          <p className="text-gray-100 text-sm">
            {content || "Terminal content here..."}
          </p>
        )}
      </div>
    </div>
  );
}
