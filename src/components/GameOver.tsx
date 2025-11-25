"use client";

import Image from "next/image";

interface RoundHistory {
  roundNumber: number;
  locationScore: number;
  yearScore: number;
  totalScore: number;
  actualLocation: string;
  actualYear: number;
  image: string;
}

interface GameOverProps {
  totalScore: number;
  history: RoundHistory[];
  onPlayAgain: () => void;
}

export default function GameOver({ totalScore, history, onPlayAgain }: GameOverProps) {
  return (
    <div className="min-h-screen bg-gray-100 p-4 flex items-center justify-center font-sans">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl overflow-hidden border border-gray-200">
        {/* Header - Compact & Screenshot friendly */}
        <div className="bg-slate-900 text-white px-8 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Mission Report</h1>
            <p className="text-slate-400 text-sm mt-1">Time Guesser Squad Day</p>
          </div>
          <div className="text-right">
            <p className="text-xs uppercase tracking-widest text-slate-400 font-semibold mb-1">Total Score</p>
            <div className="text-4xl font-bold text-yellow-400 leading-none tracking-tight">
              {totalScore.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Grid Layout for Rounds - Fits nicely on screen */}
        <div className="p-6 bg-slate-50">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {history.map((round) => (
              <div 
                key={round.roundNumber} 
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden flex flex-col hover:shadow-md transition-shadow duration-200"
              >
                {/* Image Banner */}
                <div className="relative h-32 w-full bg-gray-200">
                  <Image
                    src={`/photos/${round.image.split('/').pop()}`}
                    alt={`Round ${round.roundNumber}`}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-2 left-2 bg-black/60 text-white text-[10px] font-bold px-2 py-0.5 rounded backdrop-blur-sm uppercase tracking-wide">
                    R{round.roundNumber}
                  </div>
                  <div className="absolute bottom-2 right-2 bg-white/95 text-blue-600 font-bold text-xs px-2 py-1 rounded shadow-sm border border-blue-100">
                    {round.totalScore.toLocaleString()} pts
                  </div>
                </div>

                {/* Compact Details */}
                <div className="p-3 flex-1 flex flex-col gap-2">
                  <div>
                    <div className="font-bold text-gray-800 text-sm leading-tight truncate" title={round.actualLocation}>
                      {round.actualLocation}
                    </div>
                    <div className="text-xs text-gray-500 font-medium mt-0.5">{round.actualYear}</div>
                  </div>
                  
                  {/* Mini Score Breakdown */}
                  <div className="mt-auto pt-2 border-t border-gray-100 grid grid-cols-2 gap-2 text-[10px] text-gray-500">
                    <div className="bg-green-50 rounded px-1.5 py-1 text-center">
                      <span className="block text-green-700/70 mb-0.5">Loc</span>
                      <span className="font-bold text-green-700">+{round.locationScore}</span>
                    </div>
                    <div className="bg-blue-50 rounded px-1.5 py-1 text-center">
                      <span className="block text-blue-700/70 mb-0.5">Year</span>
                      <span className="font-bold text-blue-700">+{round.yearScore}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Compact Footer */}
        <div className="p-4 bg-white border-t border-gray-100 flex justify-center">
          <button
            onClick={onPlayAgain}
            className="bg-slate-900 text-white px-8 py-2.5 rounded-lg font-semibold hover:bg-slate-800 transition-all text-sm shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
          >
            Play Again
          </button>
        </div>
      </div>
    </div>
  );
}
