import type { OptionItem } from "../../Utils/opciones";


type Props = {
  options: OptionItem[];
  value?: string;
  onChange?: (value: string) => void;
};

const RadioGroup = ({ options, value, onChange }: Props) => (
  <>
    {options.map(opt => (
      <label key={opt.value}>
        <input
          type="radio"
          checked={value === opt.value}
          onChange={() => onChange?.(opt.value)}
        />
        {opt.label}
      </label>
    ))}
  </>
);

export default RadioGroup;