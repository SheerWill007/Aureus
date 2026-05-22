import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const [isLatin, setIsLatin] = useState(true);
  const navigate = useNavigate();
  const toggleLanguage = () => setIsLatin(!isLatin);

  return (
    <div className="min-h-screen bg-[#FFF8E7] flex flex-col items-center justify-center p-4 text-center">
      <h1 className="text-6xl font-bold text-[#D4AF37] mb-4">CDIV</h1>
      <h2 className="text-3xl font-semibold text-[#1A202C] mb-4">
        {isLatin ? "Pagina Non Inventa" : "Page Not Found"}
      </h2>
      <p className="text-xl text-[#4A5568] mb-8">
        {isLatin
          ? "Haec pagina in imperio nostro non existit."
          : "Looks like you've wandered beyond the borders of the Empire."}
      </p>

      <div className="w-76 h-76 mb-8 flex items-center justify-center">
        <div className="text-9xl">🏛️</div>
      </div>
      <p className="text-lg text-[#4A5568] mb-8 italic">
        {isLatin
          ? '"Errare humanum est." — Seneca. Even the greatest explorers lose their way!'
          : '"To err is human." — Seneca. Even the greatest explorers lose their way!'}
      </p>
      <div className="space-y-4">
        <Button
          onClick={toggleLanguage}
          className="bg-[#4A5568] hover:bg-[#2D3748] text-white font-semibold py-2 px-6 rounded-full shadow-lg transform transition-all duration-300 ease-in-out hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#4A5568] focus:ring-opacity-50"
        >
          {isLatin ? "Translate to English" : "In Linguam Latinam"}
        </Button>

        <Button
          asChild
          className="bg-[#D4AF37] hover:bg-[#E8C547] text-white font-semibold py-2 px-6 rounded-full shadow-lg transform transition-all duration-300 ease-in-out hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:ring-opacity-50"
        >
          <a onClick={() => navigate("/")}>
            {isLatin ? "Domum Redi (Home)" : "Return Home"}
          </a>
        </Button>
      </div>
      {!isLatin && (
        <p className="text-sm text-[#4A5568] mt-8 max-w-md">
          P.S. You've strayed beyond the borders of the Empire. Ave, wanderer!
        </p>
      )}
    </div>
  );
}
