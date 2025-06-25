import Image from "next/image";
import styles from "./button.module.scss"

export interface ButtonProps {
    title: string;
    variant: 'primary' | 'secondary' | 'clearFilters',
    handleFunction?: (e: React.SyntheticEvent) => void,
    icon?: any;
}

export default function Button({ title, variant, handleFunction, icon }: ButtonProps) {
    return (
        <div className={`${styles.button} ${styles[variant]}`}>

            <button onClick={handleFunction}>
                {icon && <Image src={icon} alt="icone" />}
                {title}
            </button>
        </div>
    )
}