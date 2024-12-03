"use client";
import React, { useState } from "react";
import Modal from "./components/modal"; // Componente para los detalles del evento
import Cart from "./components/cart"; // Componente para el carrito

const HomePage = () => {
  const [cart, setCart] = useState([]);
  const [modalData, setModalData] = useState(null); // Modal para los detalles del evento
  const [warningModal, setWarningModal] = useState(false); // Modal de advertencia
  const [isCartOpen, setIsCartOpen] = useState(false); // Controla el estado del carrito

  const events = [
    {
      id: '1',
      image: './CARDFINDEAÑO.png',
      name: 'FIESTA FIN DE AÑO',
      price: 15400,
      flyer: "./FLYER.png",
      description: '28 diciembre',
      details: {
        subtitle: 'Despedimos el año en el Club',
        mainDJ: '5 litros',
        warmup: 'Manu Gómez B2B Lean. D',
        place: 'Catalina',
        time: '1:00 hs',
      },
      extraDescription:
        'Celebra el cierre del año con una noche mágica llena de música electrónica, luces y energía en el mejor club de la ciudad. Prepárate para vivir momentos inolvidables con amigos y disfrutar de los mejores DJs en un ambiente único.',
      instagramLink: 'https://www.instagram.com/southconga/',
    },
    {
      id: '2',
      image: './CARDAÑONUEVO.png',
      name: 'FIESTA AÑO NUEVO | SILVESTRE',
      price: 20000,
      flyer: "./FLYER2.png",
      description: '31 diciembre',
      details: {
        subtitle: 'Recibimos el año al aire libre',
        mainDJ: 'Silvestre',
        warmup: '5 litros live Set',
        place: 'Viejo Fred',
        time: '1:00 hs',
      },
      extraDescription:
        'Dale la bienvenida al 2025 bajo las estrellas en un evento al aire libre lleno de música, baile y una atmósfera inolvidable. Deja que la magia de Silvestre y el live set de 5 litros marquen el comienzo de un año espectacular.',
      instagramLink: 'https://www.instagram.com/southconga/',
    },
    {
      id: '3',
      image: './CARDDOBLE.jpeg',
      name: 'PROMO POR AMBAS',
      price: 33000,
      flyer: "./CARDDOBLE.jpeg",
      description: '28 y 31 diciembre',
      details: null,
      extraDescription:
        '¿No puedes decidir? ¡Vive ambas fiestas! Disfruta del cierre del año y da la bienvenida al siguiente con dos noches espectaculares. Una experiencia completa para los amantes de la música y la diversión sin límites.',
      instagramLink: 'https://www.instagram.com/southconga/',
    },
  ];

  const addToCart = (event) => {
    if (cart.length > 0 && cart[0].event.id !== event.id) {
      // Si se intenta agregar un evento diferente al que está en el carrito, muestra el modal de advertencia
      setWarningModal(true);
      return;
    }

    setCart((prevCart) => {
      const itemIndex = prevCart.findIndex((item) => item.event.id === event.id);

      if (itemIndex > -1) {
        // Si ya está en el carrito, incrementa la cantidad
        const updatedCart = prevCart.map((item, index) =>
          index === itemIndex
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
        return updatedCart;
      } else {
        // Si no está, agrega el evento
        return [...prevCart, { event, quantity: 1 }];
      }
    });

    setIsCartOpen(true); // Abre el carrito al agregar un evento
  };

  const openModal = (event) => {
    setModalData(event); // Abre el modal de detalles del evento
  };

  const closeModal = () => {
    setModalData(null); // Cierra el modal de detalles del evento
  };

  const closeWarningModal = () => {
    setWarningModal(false); // Cierra el modal de advertencia
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
    const target = document.querySelector("#eventos");
    target?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div>
      {/* Header */}
      <header
        className="relative flex justify-center items-center mb-8 w-full h-screen bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/banner.png')" }}
      >
        <div className="absolute inset-0 bg-black opacity-40"></div>
        <div className="relative z-10 flex flex-col items-center gap-5">
          <img src="/LOGO.svg" alt="Logo" className="h-52" />
          <h2 className="text-3xl font-bold text-white text-center">
            EVENTOS DE MÚSICA ELECTRÓNICA
          </h2>
          <a
            href="#eventos"
            onClick={smoothScroll}
            className="hover:text-neutral-300 hover:bg-neutral-800 text-md font-bold bg-white text-black px-10 py-1 rounded-md transition duration-500 ease-in-out"
          >
            VER EVENTOS
          </a>
        </div>
        <button onClick={() => setIsCartOpen(true)} className="fixed top-5 right-5">
          <svg
            className="w-8 h-8 text-neutral-50"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 7h14l-2-7M10 21a2 2 0 11-4 0 2 2 0 014 0zM20 21a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          {cart.reduce((sum, item) => sum + item.quantity, 0) > 0 && (
            <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs">
              {cart.reduce((sum, item) => sum + item.quantity, 0)}
            </span>
          )}
        </button>
      </header>

      {/* Lista de eventos */}
      <h3 className="text-3xl font-bold text-white pl-7 md:pl-14">NUESTROS EVENTOS</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 px-3 md:px-10 pb-28" id="eventos">
        {events.map((event) => (
          <div
            key={event.id}
            className="p-4 rounded shadow hover:shadow-lg transition flex flex-col items-center justify-between"
          >
            <div className="w-full mb-4" onClick={() => openModal(event)}>
              <img
                src={event.image}
                alt={event.name}
                className="w-full h-[40vh] object-cover rounded"
              />
            </div>
            <div className="flex flex-col text-left w-full">
              <h2 className="text-3xl font-semibold mb-1 text-neutral-200">
                {event.name}
              </h2>
              <p className="mb-1 text-[18px] text-neutral-300">
                {event.description}
              </p>
              <p className="mb-4 text-[16px] text-neutral-400">
                Precio: ${event.price}
              </p>
              <button
                onClick={() => addToCart(event)}
                className="text-neutral-300 border border-neutral-500 rounded-lg px-4 py-2 w-1/2 text-sm hover:text-neutral-900 hover:bg-neutral-300 transition-all duration-300"
              >
                Comprar
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <footer className="text-neutral-300  text-center py-4">
        <div className="grid grid-cols-3 place-items-center md:flex justify-center gap-5 items-center mb-10 px-10">
          <img src="/SURGENETICS.png" alt="Logo" className="h-14" />
          <img src="/VIEJOFRED.png" alt="Logo" className="h-14" />
          <img src="/PIERINA.png" alt="Logo" className="h-6" />
          <img src="/Rectangle.png" alt="Logo" className="h-18" />
          <img src="/BUHA.png" alt="Logo" className="" />
          <img src="/Rectangle2.png" alt="Logo" className="h-18" />
        </div>
        <p>&copy; 2024 Digi Software Solutions. Todos los derechos reservados.</p>
      </footer>

      {/* Modal de detalles del evento */}
      {typeof window !== 'undefined' && modalData && (
        <Modal event={modalData} onClose={closeModal} addToCart={addToCart} />
      )}

      {/* Modal de advertencia */}
      {warningModal && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50"
          onClick={closeWarningModal} // Cierra al hacer clic fuera del modal
        >
          <div
            className="bg-neutral-800 text-white p-6 rounded-lg shadow-lg flex flex-col justify-center items-center h-[70vh] md:w-[50vw] md:h-[50vh] relative"
            onClick={(e) => e.stopPropagation()} // Evita que se cierre al hacer clic dentro del modal
          >
            {/* Botón para cerrar con "X" */}
            <button
              onClick={closeWarningModal}
              className="absolute top-4 right-4 text-white text-2xl font-bold hover:text-gray-300 transition-all"
            >
              &times;
            </button>

            {/* Contenido del modal */}
            <h2 className="text-4xl font-bold mb-4">Eventos Diferentes</h2>
            <p className="text-center text-2xl mb-4">No puedes agregar diferentes eventos al carrito.</p>
            <p className="text-center mb-6">¿Quieres comprar el Combo de Eventos?</p>
            <div className="flex gap-4">
              <button
                onClick={closeWarningModal}
                className="bg-neutral-500 hover:bg-neutral-600 text-white font-semibold px-6 py-2 rounded-lg transition-all"
              >
                Cerrar
              </button>
              <button
                onClick={() => {
                  closeWarningModal();
                  setCart([{ event: events.find((e) => e.id === "3"), quantity: 1 }]); // Borra el carrito y agrega el combo
                  setIsCartOpen(true); // Abre el carrito para mostrar el combo
                }}
                className="bg-neutral-500 hover:bg-neutral-600 text-white font-semibold px-6 py-2 rounded-lg transition-all"
              >
                Agregar Combo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Carrito */}
      {typeof window !== 'undefined' && isCartOpen && (
        <Cart
          cart={cart}
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          updateQuantity={updateQuantity}
        />
      )}
    </div>
  );
};

export default HomePage;
