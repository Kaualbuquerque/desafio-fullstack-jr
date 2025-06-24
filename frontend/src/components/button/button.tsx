import styles from "./button.module.scss"

export interface ButtonProps {
    title: string;
}

export default function Button({title}: ButtonProps) {
    return (
        <div className={styles.button}>
            <button>{title}</button>
        </div>
    )
}