import type { OptionItem } from "../../Constants/opciones";


type Props = {
  options: OptionItem[];
  value?: string;
  onChange?: (value: string) => void;
};

const SelectInput = ({ options, value, onChange }: Props) => (
  <select value={value} onChange={e => onChange?.(e.target.value)}>
    <option value="">Seleccione...</option>
    {options.map(opt => (
      <option key={opt.value} value={opt.value}>
        {opt.label}
      </option>
    ))}
  </select>
);

export default SelectInput;