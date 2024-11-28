"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const DetalleCompra = () => {
  const router = useRouter();
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    mail: "",
    telefono: "",
    calle: "",
    altura: "",
    residencia: "",
    cuitCuil: "",
  });

  // Recupera los datos del carrito y el total desde localStorage
  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    const storedTotal = localStorage.getItem("total");

    if (storedCart) setCart(JSON.parse(storedCart));
    if (storedTotal) setTotal(parseFloat(storedTotal));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePurchase = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/create-preference", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cart, total, formData }),
      });

      const data = await response.json();

      if (data.init_point) {
        window.location.href = data.init_point; // Redirige al checkout
      } else {
        alert("Hubo un error al procesar el pago.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Hubo un error al procesar el pago.");
    }
  };

  const handleBack = () => {
    router.push("/"); // Cambia "/" por la ruta deseada
  };

  return (
    <div className="min-h-screen bg-[#171717] text-neutral-200 p-4">
      <button
        onClick={handleBack}
        className="text-neutral-200 hover:text-neutral-500 flex items-center mb-4 md:pl-10 pt-4"
      >
        <span className="mr-2">⬅</span> Volver
      </button>
      <div className="max-w-3xl mx-auto bg-neutral-800 rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-6">Detalle de Compra</h1>
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Carrito</h2>
          {cart.length === 0 ? (
            <p>El carrito está vacío.</p>
          ) : (
            <ul>
              {cart.map((item, index) => (
                <li key={index} className="flex justify-between items-center mb-4">
                  <div>
                    <span className="font-semibold">{item.event.name}</span>
                    <p className="text-sm">{item.event.description}</p>
                  </div>
                  <span>${(item.event.price * item.quantity).toFixed(2)}</span>
                </li>
              ))}
            </ul>
          )}
          <div className="border-t border-neutral-500 mt-4 pt-4">
            <p className="text-lg font-bold">TOTAL: ${total.toFixed(2)}</p>
          </div>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-4">Información Personal</h2>
          <form className="space-y-4">
            <input
              type="text"
              name="nombre"
              placeholder="Nombre"
              value={formData.nombre}
              onChange={handleInputChange}
              className="w-full p-2 bg-neutral-700 text-neutral-200 rounded"
            />
            <input
              type="text"
              name="apellido"
              placeholder="Apellido"
              value={formData.apellido}
              onChange={handleInputChange}
              className="w-full p-2 bg-neutral-700 text-neutral-200 rounded"
            />
            <input
              type="email"
              name="mail"
              placeholder="Correo electrónico"
              value={formData.mail}
              onChange={handleInputChange}
              className="w-full p-2 bg-neutral-700 text-neutral-200 rounded"
            />
            <input
              type="tel"
              name="telefono"
              placeholder="Teléfono"
              value={formData.telefono}
              onChange={handleInputChange}
              className="w-full p-2 bg-neutral-700 text-neutral-200 rounded"
            />
            <input
              type="text"
              name="cuitCuil"
              placeholder="CUIT/CUIL"
              value={formData.cuitCuil}
              onChange={handleInputChange}
              className="w-full p-2 bg-neutral-700 text-neutral-200 rounded"
            />
            <h3 className="text-lg font-medium">Domicilio</h3>
            <input
              type="text"
              name="calle"
              placeholder="Calle"
              value={formData.calle}
              onChange={handleInputChange}
              className="w-full p-2 bg-neutral-700 text-neutral-200 rounded"
            />
            <input
              type="text"
              name="altura"
              placeholder="Altura"
              value={formData.altura}
              onChange={handleInputChange}
              className="w-full p-2 bg-neutral-700 text-neutral-200 rounded"
            />
            <input
              type="text"
              name="residencia"
              placeholder="Residencia (Barrio, Departamento, etc.)"
              value={formData.residencia}
              onChange={handleInputChange}
              className="w-full p-2 bg-neutral-700 text-neutral-200 rounded"
            />
          </form>
        </div>
        <div className="mt-6">
          <button
            onClick={handlePurchase}
            className="w-full bg-neutral-300 text-black rounded-lg py-2 hover:bg-neutral-400 transition-all duration-300"
          >
            Confirmar Compra
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetalleCompra;
