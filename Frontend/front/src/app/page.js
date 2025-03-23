"use client";
import { useProductos, useAgregarProducto, useEliminarProducto , useEditarProducto} from '../hooks/useProductos';
import { useState } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '../lib/react-query';

export default function Home() {
  return (
    <QueryClientProvider client={queryClient}>
      <ProductosPage />
    </QueryClientProvider>
  );
}

function ProductosPage() {
  const { data: productos, isLoading } = useProductos();
  const agregarProducto = useAgregarProducto();
  const eliminarProducto = useEliminarProducto();
  const editarProducto = useEditarProducto();

  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');
  const [editando, setEditando] = useState(null);
  const [error, setError] = useState(''); 

  const handleAgregar = () => {
    
    if (!nombre.trim()) {
      setError('El nombre no puede estar vacío.');
      return;
    }

    const precioNum = parseFloat(precio);
    if (isNaN(precioNum) || precioNum <= 0) {
      setError('El precio debe ser un número mayor a 0');
      return;
    }

    setError(''); 

    if (editando) {
      editarProducto.mutate({ id: editando, nombre, precio: precioNum });
      setEditando(null);
    } else {
      agregarProducto.mutate({ nombre, precio: precioNum });
    }

    setNombre('');
    setPrecio('');
  };

  const handleEditar = (producto) => {
    setEditando(producto.id);
    setNombre(producto.nombre);
    setPrecio(producto.precio);
    setError('');
  };

  if (isLoading) return <p className="text-center mt-10">Cargando productos...</p>;

  return (
    <div className="max-w-2xl mx-auto p-4 bg-white shadow-md rounded">
      <h1 className="text-2xl font-bold mb-4 text-center">Lista de Productos</h1>

   
      {error && <p className="text-red-500 text-center">{error}</p>}

      <div className="mb-4 flex gap-2">
        <input
          className="border p-2 flex-1"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
        <input
          className="border p-2 flex-1"
          placeholder="Precio"
          type="number"
          value={precio}
          onChange={(e) => setPrecio(e.target.value)}
          min="1" 
        />
        <button
          onClick={handleAgregar}
          className="bg-blue-500 text-white p-2 rounded"
        >
          {editando ? 'Guardar' : 'Agregar'}
        </button>
      </div>

      <ul>
        {productos?.map((producto) => (
          <li key={producto.id} className="flex justify-between border-b p-2">
            {producto.nombre} - ${producto.precio}
            <div className="flex gap-2">
              <button onClick={() => handleEditar(producto)} className="text-yellow-500">
                Editar
              </button>
              <button onClick={() => eliminarProducto.mutate(producto.id)} className="text-red-500">
                Eliminar
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}


