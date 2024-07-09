// components/LoadingSpinner.tsx
const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center min-h-auto">
      <div className="w-12 h-12 border-4 border-dashed rounded-full animate-spin border-blue-500"></div>
    </div>
  );
};

export default LoadingSpinner;
