import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const UbicacionAutocompletado = ({ onUbicacionSelect, initialValue = '', disabled = false }) => {
  const [searchTerm, setSearchTerm] = useState(initialValue);
  const [ubicaciones, setUbicaciones] = useState([]);
  const containerRef = useRef(null);

  // Fetch locations from Mapbox API
  const fetchUbicaciones = async (term) => {
    if (!term.trim()) return;

    const accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
      term
    )}.json?access_token=${accessToken}&autocomplete=true&limit=5&language=es`;

    try {
      const response = await axios.get(url);
      const features = response.data.features;
      setUbicaciones(features);
    } catch (error) {
      console.error('Error fetching ubicaciones:', error);
    }
  };

  const handleInputChange = (event) => {
    const term = event.target.value;
    setSearchTerm(term);

    if (term.length > 2) {
      fetchUbicaciones(term);
    } else {
      setUbicaciones([]);
    }
  };

  const handleUbicacionSelect = (ubicacion) => {
    setSearchTerm(ubicacion.place_name);
    onUbicacionSelect(ubicacion);
    setUbicaciones([]); // Close suggestions list
  };

  const handleClickOutside = (event) => {
    if (containerRef.current && !containerRef.current.contains(event.target)) {
      setUbicaciones([]);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={containerRef}>
      <input
        type="text"
        placeholder="Buscar ubicación"
        value={searchTerm}
        onChange={handleInputChange}
        disabled={disabled}
        className={`w-full p-2 bg-neutral-700 text-neutral-200 rounded ${disabled ? 'bg-gray-300 cursor-not-allowed' : ''
          }`}
      />
      {!disabled && ubicaciones.length > 0 && (
        <ul className="absolute z-10 bg-white border border-gray-300 rounded-b-md shadow-lg w-full mt-1 text-black">
          {ubicaciones.map((ubicacion) => (
            <li
              key={ubicacion.id}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleUbicacionSelect(ubicacion)}
            >
              {ubicacion.place_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UbicacionAutocompletado;
