import styles from "./modal-coupon.module.scss"

interface ModalCouponProps {
    code: string;
    onSelect: (code: string) => void;
  }

export default function ModalCoupon({ code, onSelect }: ModalCouponProps) {
    return (
        <div className={styles.modalCoupon} onClick={() => onSelect(code)}>
            <span>{code}</span>
        </div>
    )
}