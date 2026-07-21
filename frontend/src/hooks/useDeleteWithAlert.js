
import Swal from "sweetalert2";
import { api } from "../services/api";

export const useDeleteWithAlert = () => {
    const confirmDelete = async ({ url, id, title, onSuccess }) => {
        const result = await Swal.fire({
            title: title || '¿Estás seguro?',
            text: 'No podrás revertir esta acción.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: "Eliminar",
            cancelButtonText: "Cancelar"
        });

        if (result.isConfirmed) {
            try {
                const res = await api(
                    `${url}/${id}`,
                    { method: 'DELETE' }
                );
                if (res.ok) {
                    onSuccess(id);
                    Swal.fire(
                        '¡Borrado!',
                        'Eliminado con éxito.',
                        'success'
                    );
                }
            } catch (err) {
                Swal.fire('Error', 'No se pudo eliminar.', 'error');
            }
        }
    }

    return { confirmDelete };
}
