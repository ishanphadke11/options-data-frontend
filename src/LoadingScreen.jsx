import React from "react";

const LoadingScreen = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[300px] text-white">
            <div className="w-16 h-16 border-4 border-white border-dashed rounded-full animate-spin"></div>
            <p>
                Fetching data...
            </p>
        </div>
    )
}

export default LoadingScreen;
{/*
    // src/components/LoadingScreen.jsx
function LoadingScreen() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] text-white">
      <div className="w-16 h-16 border-4 border-white border-dashed rounded-full animate-spin"></div>
      <p className="mt-4 text-lg font-medium animate-pulse">
        Fetching options data...
      </p>
    </div>
  )
}

export default LoadingScreen

    */}