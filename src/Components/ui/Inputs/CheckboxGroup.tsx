import type { OptionItem } from "../../Constants/opciones";


type Props = {
  options: OptionItem[];
  value?: string[];
  onChange?: (value: string[]) => void;
};

const CheckboxGroup = ({ options, value = [], onChange }: Props) => {
  const toggle = (val: string) => {
    const updated = value.includes(val)
      ? value.filter(v => v !== val)
      : [...value, val];

    onChange?.(updated);
  };

  return (
    <>
      {options.map(opt => (
        <label key={opt.value}>
          <input
            type="checkbox"
            checked={value.includes(opt.value)}
            onChange={() => toggle(opt.value)}
          />
          {opt.label}
        </label>
      ))}
    </>
  );
};

export default CheckboxGroup;