import { useNavigate } from "react-router-dom";
import { FileText } from "lucide-react";
import type { FormatoSIG } from "../../../typesScript/preoperacionalType";

interface Props {
  formato: FormatoSIG;
}

const CardFormato = ({ formato }: Props) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/formatos/${formato.id}`)}
      className="cursor-pointer rounded-xl border bg-white p-4 shadow-sm hover:shadow-md transition group"
    >
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition">
          <FileText className="text-blue-600" size={24} />
        </div>
        <div>
          <h3 className="font-semibold text-slate-900 line-clamp-1">{formato.nombreFormato}</h3>
          <p className="text-xs font-medium text-slate-500">{formato.codigoSIG}</p>
        </div>
      </div>

      <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-50">
        <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-1 rounded uppercase tracking-wider font-bold">
          v{formato.version}
        </span>
        <span className="text-xs text-blue-600 font-medium">Ver formato →</span>
      </div>
    </div>
  );
};


export default CardFormato;
