"use client";
import React, { useState } from 'react';
import Modal from './components/modal'; // Componente para el modal
import Cart from './components/cart'; // Componente para el carrito

const HomePage = () => {
  const [cart, setCart] = useState([]);
  const [modalData, setModalData] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false); // Estado para controlar la apertura del carrito

  const events = [
    {
      id: '1',
      image: './event.png',
      name: 'Fiesta del 28 de Diciembre',
      price: 15000,
      description: 'Fiesta inolvidable el 28 de diciembre.',
    },
    {
      id: '2',
      image: './event.png',
      name: 'Fiesta del 31 de Diciembre',
      price: 20000,
      description: 'Celebra el Año Nuevo con estilo.',
    },
    {
      id: '3',
      image: './event.png',
      name: 'Ambas Fiestas',
      price: 30000,
      description: 'Acceso a las dos fiestas por un precio único.',
    },
  ];

  // Función para agregar eventos al carrito
  const addToCart = (event) => {
    setCart((prevCart) => {
      // Buscar si el evento ya está en el carrito
      const itemIndex = prevCart.findIndex((item) => item.event.id === event.id);
      
      if (itemIndex > -1) {
        // Si ya está, actualiza la cantidad
        const updatedCart = prevCart.map((item, index) =>
          index === itemIndex
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
        return updatedCart;
      } else {
        // Si no está, lo agrega con cantidad 1
        return [...prevCart, { event, quantity: 1 }];
      }
    });
  
    // Abrir el carrito si estaba vacío antes de agregar el nuevo ítem
    setIsCartOpen((prevCart) => prevCart.length === 0);
  };
  

  // Función para abrir el modal
  const openModal = (event) => {
    setModalData(event);
  };

  // Función para cerrar el modal
  const closeModal = () => {
    setModalData(null);
  };

  // Funciones para abrir y cerrar el carrito
  const openCart = () => {
    setIsCartOpen(true);
  };

  const closeCart = () => {
    setIsCartOpen(false);
  };

  // Función para actualizar la cantidad de un evento en el carrito
  const updateQuantity = (eventId, change) => {
    setCart((prevCart) => {
      const updatedCart = prevCart
        .map((item) => {
          if (item.event.id === eventId) {
            const newQuantity = item.quantity + change;
            if (newQuantity > 0) {
              return { ...item, quantity: newQuantity };
            } else {
              return null; // Marcar para eliminar
            }
          }
          return item;
        })
        .filter((item) => item !== null); // Eliminar los elementos marcados
      return updatedCart;
    });
  };

  return (
    <div className="container mx-auto p-4">
      {/* Header con el ícono del carrito */}
      <header className="flex justify-center items-center mb-8">
        <img src="/Logo.png" alt="Logo" className="h-52" />
        <button onClick={openCart} className="absolute top-5 right-5">
          {/* Ícono de carrito */}
          <svg
            className="w-8 h-8 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 7h14l-2-7M10 21a2 2 0 11-4 0 2 2 0 014 0zM20 21a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          {/* Contador de ítems en el carrito */}
          {cart.reduce((sum, item) => sum + item.quantity, 0) > 0 && (
            <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs">
              {cart.reduce((sum, item) => sum + item.quantity, 0)}
            </span>
          )}
        </button>
      </header>

      {/* Lista de eventos */}
      <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
        {events.map((event) => (
          <div
            key={event.id}
            className="border p-4 gap-10 rounded shadow hover:shadow-lg transition flex"
            onClick={() => openModal(event)}
          >
            <div className="h-40bg-gray-300 w-[200px]">
              <img src={event.image} alt={event.name} className="w-full h-full object-cover" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">{event.name}</h2>
              <p>Precio: ${event.price}</p>
              <button
                onClick={() => addToCart(event)}
                className="bg-green-500 text-white px-4 py-2 mt-4 rounded"
              >
                Comprar
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de detalles del evento */}
      {typeof window !== 'undefined' && modalData && (
        <Modal event={modalData} onClose={closeModal} addToCart={addToCart} />
      )}

      {typeof window !== 'undefined' && isCartOpen && (
        <Cart
          cart={cart}
          isOpen={isCartOpen}
          onClose={closeCart}
          updateQuantity={updateQuantity}
        />
      )}
    </div>
  );
};

export default HomePage;
