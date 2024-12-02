"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import UbicacionAutocompletado from "../components/ubicacion";

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
    ciudad: "",
    provincia: "",
    postalCode: "",
    documento: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    const storedTotal = localStorage.getItem("total");

    if (storedCart) setCart(JSON.parse(storedCart));
    if (storedTotal) setTotal(parseFloat(storedTotal));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "documento") {
      if (!/^\d*$/.test(value)) {
        return;
      }
    }

    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUbicacionSelect = (ubicacion) => {
    const addressParts = ubicacion.place_name.split(", ");
    const calleNumero = addressParts[0];
    const ciudad = addressParts[1];
    const provincia = addressParts[2];
    const postalCode = addressParts[3]?.split(" ")[0] || "";

    setFormData((prev) => ({
      ...prev,
      direccion: calleNumero,
      ciudad: ciudad,
      provincia: provincia,
      postalCode: postalCode,
    }));

    setErrors((prevErrors) => ({ ...prevErrors, direccion: "" }));
  };

  const validateForm = () => {
    let valid = true;
    let errors = {};

    if (!formData.nombre.trim()) {
      errors.nombre = "El nombre es obligatorio.";
      valid = false;
    }

    if (!formData.apellido.trim()) {
      errors.apellido = "El apellido es obligatorio.";
      valid = false;
    }

    if (!formData.mail.trim()) {
      errors.mail = "El correo electrónico es obligatorio.";
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.mail)) {
      errors.mail = "El correo electrónico no es válido.";
      valid = false;
    }

    if (!formData.telefono.trim()) {
      errors.telefono = "El teléfono es obligatorio.";
      valid = false;
    }

    if (!formData.documento.trim()) {
      errors.documento = "El documento es obligatorio.";
      valid = false;
    } else if (!/^\d{1,10}$/.test(formData.documento)) {
      errors.documento = "El documento debe ser un número de hasta 10 dígitos.";
      valid = false;
    }

    if (!formData.direccion.trim()) {
      errors.direccion = "La dirección es obligatoria.";
      valid = false;
    }

    setErrors(errors);
    return valid;
  };

  const handlePurchase = async () => {
    if (!validateForm()) {
      return;
    }
  
    if (cart.length === 0) {
      alert("El carrito está vacío.");
      return;
    }
  
    const eventTypeId = parseInt(cart[0].event.id, 10);
    const quantity = cart[0].quantity;
    const payerEmail = formData.mail;
  
    // Construir el payload inicial sin event_type_id ni combo_id
    const payload = {
      quantity: quantity,
      payer_email: payerEmail,
      billing_info: {
        document_type: "DNI",
        document_number: formData.documento,
        full_name: `${formData.nombre} ${formData.apellido}`,
        email: formData.mail,
        phone: formData.telefono,
        address: formData.direccion,
        city: formData.ciudad,
        postal_code: formData.postalCode || "", // Hacer postal_code opcional
      },
    };
  
    // Condicionalmente agregar event_type_id o combo_id
    if (eventTypeId === 3) {
      payload.combo_id = 1;
    } else {
      payload.event_type_id = eventTypeId;
    }
  
    // Puedes agregar un console.log aquí para verificar el payload
    console.log("Payload:", payload);
  
    setLoading(true);
  
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
        window.location.href = data.payment_url;
      } else {
        alert("Hubo un error al procesar el pago.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Hubo un error al procesar el pago.");
    } finally {
      setLoading(false);
    }
  };
  

  const handleBack = () => {
    router.push("/");
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
              {errors.nombre && <p className="text-red-500 text-sm">{errors.nombre}</p>}
            </div>

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
              {errors.apellido && <p className="text-red-500 text-sm">{errors.apellido}</p>}
            </div>

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
              {errors.mail && <p className="text-red-500 text-sm">{errors.mail}</p>}
            </div>

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
              {errors.telefono && <p className="text-red-500 text-sm">{errors.telefono}</p>}
            </div>

            <div>
              <label className="block mb-2">Documento (DNI o Pasaporte Extranjero)</label>
              <input
                type="text"
                name="documento"
                placeholder="Ingrese su documento"
                maxLength={10}
                value={formData.documento}
                onChange={handleInputChange}
                className={`w-full p-2 bg-neutral-700 text-neutral-200 rounded ${
                  errors.documento ? "border border-red-500" : ""
                }`}
              />
              {errors.documento && <p className="text-red-500 text-sm">{errors.documento}</p>}
            </div>

            <h3 className="text-lg font-medium">Domicilio</h3>
            <span className="text-sm">Buscar en este orden: calle, número, localidad, provincia</span>
            <div>
              <UbicacionAutocompletado
                onUbicacionSelect={handleUbicacionSelect}
                initialValue={formData.direccion}
              />
              {errors.direccion && <p className="text-red-500 text-sm">{errors.direccion}</p>}
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
