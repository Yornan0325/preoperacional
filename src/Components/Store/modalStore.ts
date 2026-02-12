import { create } from "zustand";

interface ModalState {
  isOpen: boolean;
  activeModal: string | null;
  openModal: (modalId: string) => void;
  closeModal: () => void;
  toggleModal: (modalId: string) => void;
}

const useModalStore = create<ModalState>((set) => ({
  isOpen: false,
  activeModal: null,
  openModal: (modalId) =>
    set({
      isOpen: true,
      activeModal: modalId,
    }),

    closeModal: () =>
    set({
      isOpen: false,
      activeModal: null,
    }),

    toggleModal: (modalId) =>
    set((state) => ({
      isOpen: state.activeModal !== modalId || !state.isOpen,
      activeModal: state.activeModal === modalId ? null : modalId,
    })),
}));

export default useModalStore;
