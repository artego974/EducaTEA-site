import React from 'react';

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white">
      {/* Spinner animado */}
      <div className="w-16 h-16 border-4 border-gray-200 border-t-[#1A3879] rounded-full animate-spin"></div>
      
      {/* Texto opcional */}
      <p className="mt-4 text-[#1A3879] font-bold text-lg animate-pulse">
        Carregando...
      </p>
    </div>
  );
}