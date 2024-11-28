"use client";
import React from "react";
import { FaTrash } from "react-icons/fa";

const Cart = ({ cart, isOpen, onClose, updateQuantity }) => {
  const subtotal = cart.reduce(
    (sum, item) => sum + item.event.price * item.quantity,
    0
  );
  const total = subtotal;

  const handlePurchase = async () => {
    try {
      const response = await fetch(
        "http://localhost:3001/api/create-preference",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ cart, total }),
        }
      );

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
          className="fixed inset-0 bg-[#171717] bg-opacity-50 z-10"
          onClick={onClose}
        />
      )}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-[#171717] shadow-lg z-20 transform transition-transform duration-300 ${isOpen ? "translate-x-0" : "translate-x-full"
          }`}
      >
        <div className="p-4 flex justify-between items-center border-b border-neutral-500">
          <h2 className="text-xl font-bold text-gray-300">Carrito</h2>
          <button
            onClick={onClose}
            className="text-gray-300 hover:text-neutral-600 text-2xl"
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
                <li key={index} className="mb-4 text-gray-300 flex justify-between items-start gap-2">
                  <div className="flex flex-col justify-between text-[15px]">
                    <span className="font-semibold">{item.event.name} | {item.event.description}</span>
                    <span>${(item.event.price * item.quantity).toFixed(2)}</span>
                  </div>
                  <div className="flex items-center">
                    <button
                      onClick={() => updateQuantity(item.event.id, -1)}
                      className="px-2 py-1 bg-neutral-800 rounded-l"
                    >
                      -
                    </button>
                    <span className="px-4 py-1 border-t border-b">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.event.id, 1)}
                      className="px-2 py-1 bg-neutral-800 rounded-r"
                    >
                      +
                    </button>
                    <button
                      onClick={() =>
                        updateQuantity(item.event.id, -item.quantity)
                      }
                      className="ml-4 text-red-500"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="p-4 border-t border-neutral-500 text-gray-300">
          <p className="text-md pb-4">TOTAL: ${total.toFixed(2)}</p>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handlePurchase();
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
    </>
  );
};

export default Cart;
