"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import YearSlider from "@/components/YearSlider";
import ImageViewer from "@/components/ImageViewer";
import GameOver from "@/components/GameOver";
import data from "@/data/data.json";

// Dynamically import Map component to avoid SSR issues with Leaflet
const GameMap = dynamic(() => import("@/components/GameMap"), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-gray-100 animate-pulse rounded-lg" />,
});

interface RoundResult {
  yearScore: number;
  locationScore: number;
  totalScore: number;
  actualYear: number;
  actualLocation: { lat: number; lng: number };
}

interface RoundHistory {
  roundNumber: number;
  locationScore: number;
  yearScore: number;
  totalScore: number;
  actualLocation: string;
  actualYear: number;
  image: string;
}

export default function Game() {
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedYear, setSelectedYear] = useState(2010);
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [hasGuessed, setHasGuessed] = useState(false);
  const [result, setResult] = useState<RoundResult | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const [history, setHistory] = useState<RoundHistory[]>([]);

  const currentRoundData = data[round];
  const totalRounds = data.length;

  const calculateScore = () => {
    if (!selectedLocation) return;

    // Calculate Year Score (Max 5000)
    // Lose points based on year difference
    const yearDiff = Math.abs(selectedYear - currentRoundData.year);
    const yearScore = Math.max(0, 5000 - yearDiff * 200);

    // Calculate Location Score (Max 5000)
    // Simple distance calculation (Haversine formula approximation for game purposes)
    const R = 6371; // Earth's radius in km
    const dLat = ((currentRoundData.lat - selectedLocation.lat) * Math.PI) / 180;
    const dLon = ((currentRoundData.lng - selectedLocation.lng) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((selectedLocation.lat * Math.PI) / 180) *
        Math.cos((currentRoundData.lat * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    // Lose points based on distance (0 points if > 3000km away)
    // Tighter scoring: Max 5000, drops linearly to 0 at 3000km
    const locationScore = Math.max(0, Math.round(5000 * (1 - distance / 3000)));

    const roundTotal = yearScore + locationScore;

    setResult({
      yearScore,
      locationScore,
      totalScore: roundTotal,
      actualYear: currentRoundData.year,
      actualLocation: { lat: currentRoundData.lat, lng: currentRoundData.lng },
    });
    setScore((prev) => prev + roundTotal);
    setHistory((prev) => [
      ...prev,
      {
        roundNumber: round + 1,
        locationScore,
        yearScore,
        totalScore: roundTotal,
        actualLocation: currentRoundData.locationString,
        actualYear: currentRoundData.year,
        image: currentRoundData.image,
      },
    ]);
    setHasGuessed(true);
  };

  const nextRound = () => {
    if (round + 1 < totalRounds) {
      setRound((prev) => prev + 1);
      setSelectedYear(2000);
      setSelectedLocation(null);
      setHasGuessed(false);
      setResult(null);
    } else {
      setGameOver(true);
    }
  };

  if (gameOver) {
    return (
      <GameOver
        totalScore={score}
        history={history}
        onPlayAgain={() => window.location.reload()}
      />
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100 overflow-hidden">
      {/* Top Bar */}
      <div className="bg-white shadow-md p-4 z-10 flex justify-between items-center">
        <div className="font-bold text-xl text-gray-800">Geo Expansion Time Guessr</div>
        <div className="flex gap-6 text-gray-700 font-medium">
          <span>Round: {round + 1} / {totalRounds}</span>
          <span>Score: {score}</span>
        </div>
      </div>

      <div className="flex-1 relative flex flex-col md:flex-row">
        {/* Image Area */}
        <div className="flex-1 relative bg-black min-h-[40vh] md:h-auto">
          <div className="absolute inset-0 flex items-center justify-center">
            <ImageViewer
              src={`/photos/${currentRoundData.image.split('/').pop()}`}
              alt="Guess this place"
            />
          </div>
        </div>

        {/* Map Area */}
        <div className="flex-1 relative min-h-[40vh] md:h-auto border-t-4 md:border-t-0 md:border-l-4 border-gray-300">
          <div className="absolute inset-0">
            <GameMap
              onLocationSelect={(lat, lng) => !hasGuessed && setSelectedLocation({ lat, lng })}
              selectedLocation={selectedLocation}
              actualLocation={result?.actualLocation}
            />
          </div>
          
          {/* Controls Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/50 to-transparent z-[1000] pointer-events-none">
            <div className="max-w-md mx-auto space-y-4 pointer-events-auto">
              {!hasGuessed ? (
                <>
                  <YearSlider selectedYear={selectedYear} onYearChange={setSelectedYear} />
                  <button
                    onClick={calculateScore}
                    disabled={!selectedLocation}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold text-lg shadow-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                  >
                    Make Guess
                  </button>
                </>
              ) : (
                <div className="bg-white p-4 rounded-lg shadow-xl space-y-3 animate-in slide-in-from-bottom-10">
                  <h3 className="font-bold text-xl text-center border-b pb-2">Round Results</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Location Score</p>
                      <p className="font-bold text-lg text-green-600">+{result?.locationScore}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-500">Year Score</p>
                      <p className="font-bold text-lg text-green-600">+{result?.yearScore}</p>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded text-sm space-y-1">
                    <p><span className="font-semibold">Actual Location:</span> {currentRoundData.locationString}</p>
                    <p><span className="font-semibold">Actual Year:</span> {currentRoundData.year}</p>
                    <p><span className="font-semibold">Teammate:</span> {currentRoundData.teammate}</p>
                  </div>
                  <div className="text-center pt-2 border-t mt-2">
                    <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Total Round Score</p>
                    <p className="text-3xl font-bold text-blue-600">{result?.totalScore}</p>
                  </div>
                  <button
                    onClick={nextRound}
                    className="w-full bg-green-600 text-white py-2 rounded-lg font-bold hover:bg-green-700 transition-colors mt-2"
                  >
                    Next Round
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
