import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';

const obtenerProductos = async () => {
  const { data } = await api.get(''); 
  return data;
};

export const useProductos = () => {
  return useQuery({ queryKey: ['productos'], queryFn: obtenerProductos });
};

export const useAgregarProducto = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: async (producto) => {       
        return await api.post('', producto);
      },
      onSuccess: () => queryClient.invalidateQueries(['productos']),
    });
  };
  

export const useEliminarProducto = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => await api.delete(`/${id}`), 
    onSuccess: () => queryClient.invalidateQueries(['productos']),
  });
};

export const useEditarProducto = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: async ({ id, nombre, precio }) => 
        await api.put(`/${id}`, { nombre, precio }),
      onSuccess: () => queryClient.invalidateQueries(['productos']),
    });
  };
  
