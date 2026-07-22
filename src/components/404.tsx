import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Home, RefreshCcw } from "lucide-react";

export default function NotFound() {
  const [rotation, setRotation] = useState(0);
  const navigate = useNavigate();

  const spinKiwi = () => {
    setRotation(rotation + 360);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-lime-50 via-green-50 to-emerald-50 dark:from-[#0F1A0F] dark:via-[#1C1C1E] dark:to-[#0F1A0F] flex flex-col items-center justify-center p-4 text-center">
      <div className="max-w-2xl">
        <h1 className="text-8xl font-bold bg-gradient-to-r from-lime-600 to-green-600 bg-clip-text text-transparent mb-4">
          404
        </h1>
        <h2 className="text-4xl font-semibold text-gray-900 dark:text-white mb-4">
          Oops! This Kiwi Got Lost
        </h2>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
          The page you're looking for seems to have rolled away...
        </p>

        <div className="w-48 h-48 mb-8 mx-auto flex items-center justify-center relative">
          <div 
            className="text-9xl cursor-pointer transition-transform duration-700 ease-in-out hover:scale-110"
            style={{ transform: `rotate(${rotation}deg)` }}
            onClick={spinKiwi}
          >
            🥝
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-lime-400 to-green-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>
        </div>

        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 italic">
          "Not all who wander are lost, but this page definitely is!"
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            onClick={() => navigate(-1)}
            variant="outline"
            className="border-2 border-lime-300 dark:border-lime-700 hover:bg-lime-50 dark:hover:bg-lime-900/20 text-lime-700 dark:text-lime-300 font-semibold py-3 px-6 rounded-xl shadow-lg transform transition-all duration-300 hover:scale-105"
          >
            <RefreshCcw className="mr-2 h-5 w-5" />
            Go Back
          </Button>

          <Button
            onClick={() => navigate("/")}
            className="bg-gradient-to-r from-lime-500 to-green-500 hover:from-lime-600 hover:to-green-600 text-white font-semibold py-3 px-6 rounded-xl shadow-xl shadow-lime-500/30 transform transition-all duration-300 hover:scale-105"
          >
            <Home className="mr-2 h-5 w-5" />
            Return Home
          </Button>
        </div>

        <p className="text-sm text-gray-500 dark:text-gray-400 mt-8">
          💡 Tip: Click the kiwi to make it spin!
        </p>
      </div>
    </div>
  );
}
