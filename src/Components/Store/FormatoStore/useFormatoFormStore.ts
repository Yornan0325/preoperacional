import { create } from 'zustand';
import type { Section, ItemType } from '../../typesScript/formatoFormtype';

interface InspectionState {
  // GENERAL DATA
  generalData: any;
  updateFormatoGeneral: (data: any) => void;

  // CHECKLIST
  checklistTitle: string;
  setChecklistTitle: (title: string) => void;

  checklist: Section[];

  addSection: (title: string) => void;
  addItemToSection: (
    sectionId: number,
    label: string,
    type: ItemType
  ) => string;


  updateItemOptions: (
    sectionId: number,
    itemId: string,
    options: string[]
  ) => void;

  updateItemLabel: (
    sectionId: number,
    itemId: string,
    label: string
  ) => void;

  removeItem: (
    sectionId: number,
    itemId: string
  ) => void;
  removeSection: (sectionId: number) => void;
}

export const useFormatoFormStore = create<InspectionState>((set) => ({


  // GENERAL DATA
  generalData: {
    nombreFormato: '',
    version: '',
    fechaCreacion: '',
    fechaActualizacion: '',
    fechaRevision: '',
    numeralSIG: '',
    formato: '',
  },

  updateFormatoGeneral: (data) =>
    set((state) => ({
      generalData: { ...state.generalData, ...data },
    })),



  // CHECKLIST
  checklistTitle: '',
  setChecklistTitle: (title) => set({ checklistTitle: title }),

  checklist: [],

  addSection: (title) =>
    set((state) => ({
      checklist: [
        ...state.checklist,
        { id: Date.now(), title, items: [] },
      ],
    })),

  addItemToSection: (sectionId, label, type) => {
    const newItem = {
      id: crypto.randomUUID(),
      label,
      type,
      value: '', // Added missing value property
      options: type === 'select' ? [] : undefined,
    };

    set((state) => ({
      checklist: state.checklist.map(section =>
        section.id === sectionId
          ? { ...section, items: [...section.items, newItem] }
          : section
      ),
    }));

    return newItem.id;
  },

  updateItemOptions: (
    sectionId: number,
    itemId: string,
    options: string[]
  ) =>
    set((state) => ({
      checklist: state.checklist.map(section =>
        section.id === sectionId
          ? {
            ...section,
            items: section.items.map(item =>
              item.id === itemId
                ? { ...item, options }
                : item
            ),
          }
          : section
      ),
    })),

  // updateItemValue: (sectionId, itemId, value) =>
  //   set((state) => ({
  //     checklist: state.checklist.map((section) =>
  //       section.id === sectionId
  //         ? {
  //           ...section,
  //           items: section.items.map((item) =>
  //             item.id === itemId
  //               ? { ...item, value }
  //               : item
  //           ),
  //         }
  //         : section
  //     ),
  //   })),

  updateItemLabel: (sectionId, itemId, label) =>
    set((state) => ({
      checklist: state.checklist.map((section) =>
        section.id === sectionId
          ? {
            ...section,
            items: section.items.map((item) =>
              item.id === itemId
                ? { ...item, label }
                : item
            ),
          }
          : section
      ),
    })),

  removeSection: (sectionId) =>
    set((state) => ({
      checklist: state.checklist.filter((section) => section.id !== sectionId),
    })),

  removeItem: (sectionId, itemId) =>
    set((state) => ({
      checklist: state.checklist.map((section) =>
        section.id === sectionId
          ? {
            ...section,
            items: section.items.filter(
              (item) => item.id !== itemId
            ),
          }
          : section
      ),
    })),
}));
