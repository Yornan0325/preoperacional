import { CheckCircle2 } from 'lucide-react';

interface Props {
  formatos: any[];
  selectedId: string;
  onSelect: (id: string) => void;
}

export const FormatoSelector = ({ formatos, selectedId, onSelect }: Props) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {formatos.map((f) => {
        const isSelected = selectedId === f.id;
        return (
          <div
            key={f.id}
            onClick={() => onSelect(f.id)}
            className={`cursor-pointer p-4 rounded-xl border-2 transition-all flex items-center justify-between ${
              isSelected 
                ? 'border-blue-600 bg-blue-50 shadow-md' 
                : 'border-slate-100 bg-white hover:border-slate-300'
            }`}
          >
            <div>
              <p className={`text-[10px] font-black uppercase ${isSelected ? 'text-blue-600' : 'text-slate-800'}`}>
                {f.nombreFormato}
              </p>
              <p className="text-[9px] text-slate-400 font-bold uppercase">{f.numeralSIG}</p>
            </div>
            {isSelected && <CheckCircle2 size={18} className="text-blue-600" />}
          </div>
        );
      })}
    </div>
  );
};