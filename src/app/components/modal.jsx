// components/Modal.js
"use client";
import React, { useState } from 'react';

const Modal = ({ event, onClose, addToCart }) => {
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  const handlePurchase = () => {
    // Aquí puedes manejar la lógica de compra
    alert(`Compraste: ${event.name}\nTeléfono: ${phone}\nEmail: ${email}`);
    onClose();
  };

  return (
    <>
      {/* Overlay para cerrar al hacer clic afuera */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-30"
        onClick={onClose}
      />

      {/* Contenido del modal */}
      <div className="fixed inset-0 flex items-center justify-center z-40">
        <div className="bg-neutral-900 p-6 rounded shadow-lg w-full max-w-md relative">
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-gray-300 hover:text-black text-2xl"
          >
            &times;
          </button>
          <h2 className="text-xl font-bold mb-4 text-gray-300">{event.name}</h2>
          <p className="mb-4 text-gray-300">{event.description}</p>
          <p className="mb-4 text-gray-300">Precio: ${event.price}</p>
          <form>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300">Teléfono:</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full border px-2 py-1 rounded text-gray-700"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300">
                Correo Electrónico:
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border px-2 py-1 rounded text-gray-700"
                required
              />
            </div>
            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => {
                  addToCart(event);
                  onClose();
                }}
                className="bg-green-500 text-white px-4 py-2 rounded"
              >
                Agregar al Carrito
              </button>
              <button
                type="button"
                onClick={handlePurchase}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Comprar Ahora
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Modal;
