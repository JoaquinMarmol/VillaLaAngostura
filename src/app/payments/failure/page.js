'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { FaArrowLeft } from 'react-icons/fa';

const FailurePage = () => {
  const router = useRouter();

  const handleGoBack = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-[#171717] flex flex-col items-center justify-center text-white relative">
      {/* Flecha para volver */}
      <button
        onClick={handleGoBack}
        className="absolute top-5 left-5 flex items-center text-white hover:text-gray-300"
      >
        <FaArrowLeft className="mr-2" />
        Volver a la página
      </button>

      {/* Contenido principal */}
      <div className="text-center p-6 rounded-lg shadow-lg bg-neutral-800">
        <h1 className="text-4xl font-bold mb-4">Pago Fallido</h1>
        <p className="text-xl mb-6">
          Hubo un problema al procesar tu pago.
        </p>
        <p className="text-lg">
          Por favor, intenta nuevamente o contáctanos si el problema persiste.
        </p>
      </div>
    </div>
  );
};

export default FailurePage;
