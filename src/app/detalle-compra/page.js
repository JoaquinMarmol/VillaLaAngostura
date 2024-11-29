"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import UbicacionAutocompletado from "../components/ubicacion"; // Ajusta la ruta según tu estructura de archivos

const DetalleCompra = () => {
  const router = useRouter();
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    mail: "",
    telefono: "",
    direccion: "",
    cuitPart1: "",
    cuitPart2: "",
    cuitPart3: "",
  });

  const [errors, setErrors] = useState({}); // Estado para almacenar errores de validación
  const [loading, setLoading] = useState(false); // Estado para manejar el estado de carga

  // Recupera los datos del carrito y el total desde localStorage al montar el componente
  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    const storedTotal = localStorage.getItem("total");

    if (storedCart) setCart(JSON.parse(storedCart));
    if (storedTotal) setTotal(parseFloat(storedTotal));
  }, []);

  // Maneja los cambios en los campos del formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Permitir solo números en los campos de CUIT/CUIL
    if (name === "cuitPart1" || name === "cuitPart2" || name === "cuitPart3") {
      if (!/^\d*$/.test(value)) {
        return; // Evita actualizar el estado si el valor contiene caracteres no numéricos
      }
    }

    // Limpiar errores al cambiar el valor de un campo
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Maneja la selección de una ubicación desde el componente de autocompletado
  const handleUbicacionSelect = (ubicacion) => {
    setFormData((prev) => ({
      ...prev,
      direccion: ubicacion.place_name,
    }));
    // Limpiar error de dirección si existía
    setErrors((prevErrors) => ({ ...prevErrors, direccion: "" }));
  };

  // Función para validar el formulario
  const validateForm = () => {
    let valid = true;
    let errors = {};

    // Validación del nombre
    if (!formData.nombre.trim()) {
      errors.nombre = "El nombre es obligatorio.";
      valid = false;
    }

    // Validación del apellido
    if (!formData.apellido.trim()) {
      errors.apellido = "El apellido es obligatorio.";
      valid = false;
    }

    // Validación del correo electrónico
    if (!formData.mail.trim()) {
      errors.mail = "El correo electrónico es obligatorio.";
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.mail)) {
      errors.mail = "El correo electrónico no es válido.";
      valid = false;
    }

    // Validación del teléfono
    if (!formData.telefono.trim()) {
      errors.telefono = "El teléfono es obligatorio.";
      valid = false;
    }

    // Validación del CUIT/CUIL
    const cuitCuil = `${formData.cuitPart1}${formData.cuitPart2}${formData.cuitPart3}`;
    if (
      !formData.cuitPart1.trim() ||
      !formData.cuitPart2.trim() ||
      !formData.cuitPart3.trim()
    ) {
      errors.cuitCuil = "El CUIT/CUIL es obligatorio.";
      valid = false;
    } else if (!isValidCuit(cuitCuil)) {
      errors.cuitCuil = "El CUIT/CUIL no es válido.";
      valid = false;
    }

    // Validación de la dirección
    if (!formData.direccion.trim()) {
      errors.direccion = "La dirección es obligatoria.";
      valid = false;
    }

    setErrors(errors);
    return valid;
  };

  // Función para validar CUIT/CUIL según el algoritmo estándar
  const isValidCuit = (cuit) => {
    cuit = cuit.replace(/[-]/g, "");
    if (cuit.length !== 11 || !/^\d+$/.test(cuit)) return false;

    const mult = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2];
    let total = 0;

    for (let i = 0; i < mult.length; i++) {
      total += parseInt(cuit[i]) * mult[i];
    }

    const mod11 = 11 - (total % 11);
    let verificador = mod11 === 11 ? 0 : mod11 === 10 ? 9 : mod11;

    return parseInt(cuit[10]) === verificador;
  };

  // Función para manejar la compra
  const handlePurchase = async () => {
    if (!validateForm()) {
      return; // Detener si el formulario no es válido
    }

    // Combinar las partes del CUIT/CUIL antes de enviar
    const cuitCuil = `${formData.cuitPart1}-${formData.cuitPart2}-${formData.cuitPart3}`;

    // Extraer event_type_id y quantity del carrito
    if (cart.length === 0) {
      alert("El carrito está vacío.");
      return;
    }

    const eventTypeId = cart[0].event.id; // Asumiendo que solo hay un tipo de evento en el carrito
    const quantity = cart[0].quantity;
    const payerEmail = formData.mail;

    // Configurar el payload para la solicitud POST
    const payload = {
      event_type_id: eventTypeId,
      quantity: quantity,
      payer_email: payerEmail,
      // Agregar todos los campos del formulario
      nombre: formData.nombre,
      apellido: formData.apellido,
      telefono: formData.telefono,
      direccion: formData.direccion,
      cuit_cuil: cuitCuil,
    };

    setLoading(true); // Iniciar estado de carga

    try {
      const response = await fetch("https://digisoftware.online/api/payment-intents/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Error en la solicitud de pago.");
      }

      const data = await response.json();

      if (data.payment_url) {
        window.location.href = data.payment_url; // Redirige al checkout de MercadoPago
      } else {
        alert("Hubo un error al procesar el pago.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Hubo un error al procesar el pago.");
    } finally {
      setLoading(false); // Finalizar estado de carga
    }
  };

  // Función para regresar a la página principal
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
                <li
                  key={index}
                  className="flex justify-between items-center mb-4"
                >
                  <div>
                    <span className="font-semibold">{item.event.name}</span>
                    <p className="text-sm">{item.event.description}</p>
                  </div>
                  <span>
                    ${(item.event.price * item.quantity).toFixed(2)}
                  </span>
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
            {/* Nombre */}
            <div>
              <input
                type="text"
                name="nombre"
                placeholder="Nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                className={`w-full p-2 bg-neutral-700 text-neutral-200 rounded ${
                  errors.nombre ? "border border-red-500" : ""
                }`}
              />
              {errors.nombre && (
                <p className="text-red-500 text-sm">{errors.nombre}</p>
              )}
            </div>

            {/* Apellido */}
            <div>
              <input
                type="text"
                name="apellido"
                placeholder="Apellido"
                value={formData.apellido}
                onChange={handleInputChange}
                className={`w-full p-2 bg-neutral-700 text-neutral-200 rounded ${
                  errors.apellido ? "border border-red-500" : ""
                }`}
              />
              {errors.apellido && (
                <p className="text-red-500 text-sm">{errors.apellido}</p>
              )}
            </div>

            {/* Correo electrónico */}
            <div>
              <input
                type="email"
                name="mail"
                placeholder="Correo electrónico"
                value={formData.mail}
                onChange={handleInputChange}
                className={`w-full p-2 bg-neutral-700 text-neutral-200 rounded ${
                  errors.mail ? "border border-red-500" : ""
                }`}
              />
              {errors.mail && (
                <p className="text-red-500 text-sm">{errors.mail}</p>
              )}
            </div>

            {/* Teléfono */}
            <div>
              <input
                type="tel"
                name="telefono"
                placeholder="Teléfono"
                value={formData.telefono}
                onChange={handleInputChange}
                className={`w-full p-2 bg-neutral-700 text-neutral-200 rounded ${
                  errors.telefono ? "border border-red-500" : ""
                }`}
              />
              {errors.telefono && (
                <p className="text-red-500 text-sm">{errors.telefono}</p>
              )}
            </div>

            {/* CUIT/CUIL */}
            <div>
              <label className="block mb-2">CUIT/CUIL</label>
              <div className="flex space-x-2">
                {/* Parte 1 */}
                <input
                  type="text"
                  name="cuitPart1"
                  placeholder="00"
                  maxLength={2}
                  value={formData.cuitPart1}
                  onChange={handleInputChange}
                  className={`w-1/4 p-2 bg-neutral-700 text-neutral-200 rounded ${
                    errors.cuitCuil ? "border border-red-500" : ""
                  }`}
                />
                <span className="self-center">-</span>
                {/* Parte 2 */}
                <input
                  type="text"
                  name="cuitPart2"
                  placeholder="00000000"
                  maxLength={8}
                  value={formData.cuitPart2}
                  onChange={handleInputChange}
                  className={`w-1/2 p-2 bg-neutral-700 text-neutral-200 rounded ${
                    errors.cuitCuil ? "border border-red-500" : ""
                  }`}
                />
                <span className="self-center">-</span>
                {/* Parte 3 */}
                <input
                  type="text"
                  name="cuitPart3"
                  placeholder="0"
                  maxLength={1}
                  value={formData.cuitPart3}
                  onChange={handleInputChange}
                  className={`w-1/6 p-2 bg-neutral-700 text-neutral-200 rounded ${
                    errors.cuitCuil ? "border border-red-500" : ""
                  }`}
                />
              </div>
              {errors.cuitCuil && (
                <p className="text-red-500 text-sm">{errors.cuitCuil}</p>
              )}
            </div>

            {/* Domicilio */}
            <h3 className="text-lg font-medium">Domicilio</h3>
            <span className="text-sm">
              Buscar en este orden: calle, número, localidad, provincia
            </span>
            <div>
              <UbicacionAutocompletado
                onUbicacionSelect={handleUbicacionSelect}
                initialValue={formData.direccion}
              />
              {errors.direccion && (
                <p className="text-red-500 text-sm">{errors.direccion}</p>
              )}
            </div>
          </form>
        </div>
        <div className="mt-6">
          <button
            onClick={handlePurchase}
            disabled={loading}
            className={`w-full bg-neutral-300 text-black rounded-lg py-2 hover:bg-neutral-400 transition-all duration-300 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Procesando..." : "Confirmar Compra"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetalleCompra;
