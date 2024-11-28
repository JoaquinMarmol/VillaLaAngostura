"use client";
import React from "react";

const Modal = ({ event, onClose, addToCart }) => {
  return (
    <>
      {/* Overlay para cerrar al hacer clic afuera */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-30"
        onClick={onClose}
      />

      {/* Contenedor scrollable con fondo completo */}
      <div className="fixed inset-0 z-40 overflow-y-auto">
        <div className="min-h-screen flex justify-center items-center">
          <div className="bg-[#171717] p-6 rounded shadow-lg w-full max-w-4xl relative flex flex-col md:flex-row my-10">
            {/* Imagen a la izquierda */}
            <div className="w-full md:w-1/2">
              <img
                src={event.image}
                alt={event.name}
                className="w-full h-full object-cover rounded-l"
              />
            </div>

            {/* Detalles a la derecha */}
            <div className="w-full md:w-1/2 p-6 flex flex-col justify-between">
              {/* Botón para cerrar */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-300 hover:text-white text-2xl"
              >
                &times;
              </button>

              {/* Título del evento */}
              <div className="space-y-4">
                <h2 className="text-3xl font-bold text-white">{event.name}</h2>
                <p className="text-lg font-medium text-gray-300">
                  {event.description} 2024
                </p>
                {event.details && (
                  <>
                    <p className="text-gray-400 italic">
                      {event.details.subtitle}
                    </p>
                    <p>
                      <span className="font-bold text-gray-300">Lugar:</span>{" "}
                      {event.details.place}
                    </p>
                    <p>
                      <span className="font-bold text-gray-300">Hora:</span>{" "}
                      {event.details.time}
                    </p>
                    <p>
                      <span className="font-bold text-gray-300">
                        DJ Principal:
                      </span>{" "}
                      {event.details.mainDJ}
                    </p>
                    <p>
                      <span className="font-bold text-gray-300">Warmup:</span>{" "}
                      {event.details.warmup}
                    </p>
                  </>
                )}
              </div>

              {/* Descripción adicional */}
              {event.extraDescription && (
                <div className="mt-4 text-gray-400">
                  <p>{event.extraDescription}</p>
                </div>
              )}

              {/* Enlace a Instagram */}
              <div className="mt-4">
                <a
                  href={event.instagramLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  Visítanos en Instagram
                </a>
              </div>

              {/* Botones para acciones */}
              <div className="mt-4 flex justify-between">
                <button
                  onClick={() => {
                    addToCart(event);
                    onClose();
                    const button = e.currentTarget;
                    button.classList.add("clicked");
                    setTimeout(() => button.classList.remove("clicked"), 200); // Quita la clase después de 200ms
                  }}
                  className="text-neutral-300 border border-neutral-500 rounded-lg px-4 py-2 w-full text-sm hover:text-neutral-900 hover:bg-neutral-300 transition-all duration-300"
                >
                  Comprar
                </button>

                <style jsx>{`
                  .clicked {
                    transform: scale(1.1);
                    transition: transform 200ms ease-in-out;
                  }
                `}</style>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Modal;
