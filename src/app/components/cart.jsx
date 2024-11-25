"use client";
import React from "react";

const Cart = ({ cart, isOpen, onClose, updateQuantity }) => {
  const subtotal = cart.reduce(
    (sum, item) => sum + item.event.price * item.quantity,
    0
  );
  const serviceFee = subtotal * 0.1;
  const total = subtotal + serviceFee;

  const handlePurchase = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/create-preference", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cart, total }),
      });

      const data = await response.json();

      if (data.init_point) {
        window.location.href = data.init_point; // Redirige al checkout de Mercado Pago
      } else {
        alert("Hubo un error al procesar el pago.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Hubo un error al procesar el pago.");
    }
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-10"
          onClick={onClose}
        />
      )}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-white shadow-lg z-20 transform transition-transform duration-300 ${isOpen ? "translate-x-0" : "translate-x-full"
          }`}
      >
        <div className="p-4 flex justify-between items-center border-b">
          <h2 className="text-xl font-bold text-gray-700">Carrito</h2>
          <button
            onClick={onClose}
            className="text-gray-700 hover:text-black text-2xl"
          >
            &times;
          </button>
        </div>
        <div
          className="p-4 overflow-y-auto"
          style={{ maxHeight: "calc(100% - 160px)" }}
        >
          {cart.length === 0 ? (
            <p>El carrito está vacío.</p>
          ) : (
            <ul>
              {cart.map((item, index) => (
                <li key={index} className="mb-4 text-gray-800">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">{item.event.name}</span>
                    <span>${item.event.price * item.quantity}</span>
                  </div>
                  <div className="flex items-center mt-2">
                    <button
                      onClick={() => updateQuantity(item.event.id, -1)}
                      className="px-2 py-1 bg-gray-200 rounded-l"
                    >
                      -
                    </button>
                    <span className="px-4 py-1 border-t border-b">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.event.id, 1)}
                      className="px-2 py-1 bg-gray-200 rounded-r"
                    >
                      +
                    </button>
                    <button
                      onClick={() =>
                        updateQuantity(item.event.id, -item.quantity)
                      }
                      className="ml-4 text-red-500"
                    >
                      Eliminar
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="p-4 border-t text-gray-700">
          <p className="text-md">Subtotal: ${subtotal.toFixed(2)}</p>
          <p className="text-md">
            Cargo por servicios (10%): ${serviceFee.toFixed(2)}
          </p>
          <p className="text-lg font-bold mb-4">Total: ${total.toFixed(2)}</p>
          <button
            className="w-full bg-green-500 text-white py-2 rounded"
            onClick={handlePurchase}
          >
            Comprar
          </button>
        </div>
      </div>
    </>
  );
};

export default Cart;
