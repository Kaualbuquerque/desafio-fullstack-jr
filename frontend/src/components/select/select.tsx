import styles from "./select.module.scss"

export interface InputProps {
    name: string;
    label?: string;
    options: string[];
    required?: boolean;
    value?: string; // valor controlado
    onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void; // handler para mudanças
}

export default function Select({ name, label, options, required, value, onChange }: InputProps) {
    return (
        <div className={styles.input}>
            <label htmlFor={name}>{label}</label>
            <select
                name={name}
                id={name}
                required={required}
                value={value}
                onChange={onChange}
            >
                <option value="" disabled>Selecione uma opção</option>
                {options.map((option, index) => (
                    <option value={option} key={index}>
                        {option}
                    </option>
                ))}
            </select>
        </div>
    )
}
