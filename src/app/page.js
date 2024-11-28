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
      image: './CARDFINDEAÑO.png',
      name: 'FIN DE AÑO',
      price: 15400,
      description: '28 Dic',
    },
    {
      id: '2',      
      image: './CARDAÑONUEVO.png',
      name: 'AÑO NUEVO',
      price: 20000,
      description: '31 Dic',
    },
    {
      id: '3',
      image: './CARDDOBLE.jpeg',
      name: 'AMBAS',
      price: 33000,
      description: '28 Y 31 Dic',
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

  const smoothScroll = (e) => {
    e.preventDefault();
    const target = document.querySelector('#eventos');
    target?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="">
      {/* Header con el ícono del carrito */}
      <header className="relative flex justify-center items-center mb-8 w-full h-screen bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/banner.png')" }}>
        {/* Superposición para aplicar opacidad */}
        <div className="absolute inset-0 bg-black opacity-40"></div>
        
        {/* Contenido del banner */}
        <div className="relative z-10 flex flex-col items-center gap-5">
          <img src="/LOGO.svg" alt="Logo" className="h-52" />
          <h2 className="text-3xl font-bold text-white text-center">EVENTOS DE MÚSICA ELECTRÓNICA</h2>
          <a
            href="#eventos"
            onClick={smoothScroll}
            className="text-lg font-bold bg-white text-black px-8 rounded-md transition duration-500 ease-in-out"
          >
            VER EVENTOS
          </a>  
        </div>
        <button onClick={openCart} className="fixed top-5 right-5">
          {/* Ícono de carrito */}
          <svg
            className="w-8 h-8 text-gray-50"
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
      <h3 className='text-3xl font-bold text-white pl-7 md:pl-14'>NUESTROS EVENTOS</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 z-10 cursor-pointer px-3 md:px-10 pb-28" id='eventos'>
        {events.map((event) => (
          <div
            key={event.id}
            className="p-4 rounded shadow hover:shadow-lg transition flex flex-col items-center justify-between"
            onClick={() => openModal(event)}
          >
            {/* Imagen del evento */}
            <div className="w-full mb-4">
              <img
                src={event.image}
                alt={event.name}
                className="w-full h-[40vh] object-cover rounded"
              />
            </div>

            {/* Contenido del evento */}
            <div className="flex flex-col text-left w-full">
              <h2 className="text-3xl font-semibold mb-1">{event.name}</h2>
              <p className="mb-1 text-[18px] text-neutral-300">{event.description} 2024 |  01:00 hs</p>
              <p className="mb-4 text-[16px] text-neutral-400">Precio: ${event.price}</p>
              <button
                onClick={(e) => {
                  e.stopPropagation(); // Evita que el clic se propague al elemento padre
                  addToCart(event);
                }}
                className="text-neutral-300 border border-neutral-500 rounded-lg px-4 py-2 w-1/2 text-sm"
              >
                Comprar
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pie de página */}
      <footer className="text-neutral-300 text-center py-4 lg:mt-28">
        <p>&copy; 2024 Digi Software Solutions. Todos los derechos reservados.</p>
      </footer>

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
