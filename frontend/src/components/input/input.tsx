import styles from "./input.module.scss";

import { ChangeEvent } from "react";

export interface InputProps {
    type: string;
    name: string;
    label?: string;
    placeholder?: string;
    required?: boolean;
    value?: string | number | undefined;
    checked?: boolean;
    onChange?: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    maxLength?: number;
}

export default function Input({ type, name, label, placeholder, required, value, checked, onChange, maxLength}: InputProps) {
    return (
        <div className={`${styles.input} ${styles[name] || ""}`}>
            {label && <label htmlFor={name}>{label}</label>}
            {type === "textarea" ? (
                <textarea
                    id={name}
                    name={name}
                    placeholder={placeholder}
                    required={required}
                    value={value}
                    onChange={onChange}
                />
            ) : (
                <input
                    id={name}
                    type={type}
                    name={name}
                    placeholder={placeholder}
                    required={required}
                    value={value}
                    checked={type === "checkbox" ? checked : undefined}
                    maxLength={maxLength}
                    onChange={onChange}
                />
            )}
        </div>
    );
}
