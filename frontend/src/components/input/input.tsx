import styles from "./input.module.scss"

export interface InputProps {
    type: string;
    name: string;
    label?: string;
    placeholder: string
}

export default function Input({ type, name, label, placeholder }: InputProps) {
    return (
            <div className={styles.input}>
                <label htmlFor={name}>{label}</label>
                <input type={type} name={name} placeholder={placeholder}/>
            </div>
    )
}