import { create } from 'zustand';
import { createEquipo, type EquipoPayload } from '../../Firebase/Service/servicesSet';

interface EquipoState {
    loading: boolean;
    error: string | null;

    saveEquipo: (data: EquipoPayload) => Promise<void>;
}

const useEquipoFormStore = create<EquipoState>((set) => ({
    loading: false,
    error: null,

    saveEquipo: async (data) => {
        try {
            set({ loading: true, error: null });

            await createEquipo(data);

            set({ loading: false });
        } catch (err) {
            console.error(err);
            set({
                loading: false,
                error: 'Error al guardar el equipo',
            });
        }
    },
}));

export default useEquipoFormStore;
