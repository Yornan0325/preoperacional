import { ShieldCheck, HardHat, Users } from 'lucide-react';

export interface RegistroFirmas {
    copas: boolean;
    inspector: boolean;
    siso: boolean;
}

export const EstadoDiaCalendario = ({ firmas }: { firmas: RegistroFirmas }) => {
    const roles = [
        { id: 'inspector', label: 'Inspector', icon: HardHat, color: 'bg-emerald-500', active: firmas.inspector },
        { id: 'siso', label: 'SISO', icon: ShieldCheck, color: 'bg-sky-500', active: firmas.siso },
        { id: 'copas', label: 'COPASST', icon: Users, color: 'bg-indigo-500', active: firmas.copas },
    ];

    return (
        <div className="flex justify-center gap-1 mt-0.5" aria-label="Estado de firmas">
            {roles.map((rol) => {
                const Icon = rol.icon;
                return (
                    <div
                        key={rol.id}
                        title={`${rol.label}: ${rol.active ? 'Firmado' : 'Pendiente'}`}
                        className={`flex items-center justify-center p-px rounded-full transition-all duration-300 ${rol.active
                            ? `${rol.color} text-white shadow-sm ring-1 ring-white/10`
                            : 'bg-slate-100 text-slate-400'
                            }`}
                    >
                        <Icon size={8} strokeWidth={2.5} />
                    </div>
                );
            })}
        </div>
    );
};