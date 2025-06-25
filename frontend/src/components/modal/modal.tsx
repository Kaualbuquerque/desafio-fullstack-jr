import styles from "./modal.module.scss";

import tag from "../../../public/tag.png"
import Image from "next/image";
import Button from "../button/button";
import Input from "../input/input";
import ModalCoupon from "../modal-coupon/modal-coupon";

import buttonTagWhite from "../../../public/button-tag-white.png"
import buttonTagDark from "../../../public/button-tag-dark.png"
import buttonPercentWhite from "../../../public/button-percent-white.png"
import buttonPercentDark from "../../../public/button-percent-dark.png"
import { useState } from "react";

import { api } from "@/services/api";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    id: number;
}


export default function Modal({ isOpen, onClose, id }: ModalProps) {
    const couponCodes = ["SAVE10 (10%)", "SAVE15 (15%)", "SAVE20 (20%)", "SAVE25 (25%)", "SAVE30 (30%)", "SAVE35 (35%)", "SAVE40 (40%)", "SAVE50 (50%)"];
    const [isCouponMode, setIsCouponMode] = useState(true);
    const [couponCode, setCouponCode] = useState("");
    const [discountPercent, setDiscountPercent] = useState("");

    const handleApply = async () => {
        try {
            if (isCouponMode) {
                if (!couponCode.trim()) {
                    alert("Digite o código do cupom.");
                    return;
                }

                const normalizedCode = couponCode.trim().toLowerCase();

                await api.post(`/products/${id}/apply-coupon`, {
                    code: normalizedCode,
                });
            } else {
                const percent = parseInt(discountPercent);
                if (isNaN(percent) || percent < 1 || percent > 99) {
                    alert("Digite um valor entre 1% e 99% para o desconto.");
                    return;
                }

                await api.post(`/products/${id}/discount`, {
                    type: "percent",
                    value: percent,
                });
            }

            alert("Desconto aplicado com sucesso!");
            onClose();
            setCouponCode("");
            setDiscountPercent("");
        } catch (error) {
            console.error("Erro ao aplicar desconto:", error);
            alert("Erro ao aplicar desconto.");
        }
    };


    if (!isOpen) return null;

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <div className={styles.title}>
                    <h2><span> <Image src={tag} alt="icone de tag" /> </span>Aplicar Desconto</h2>
                    <p>Escolha como aplicar o desconto ao produto</p>
                </div>

                <div className={styles.couponType}>
                    <Button title="Código Cupon" variant={isCouponMode ? "primary" : "secondary"} icon={isCouponMode ? buttonTagWhite : buttonTagDark} handleFunction={() => setIsCouponMode(true)} />
                    <Button title="Percentual Direto" variant={!isCouponMode ? "primary" : "secondary"} icon={!isCouponMode ? buttonPercentWhite : buttonPercentDark} handleFunction={() => setIsCouponMode(false)} />
                </div>



                {isCouponMode ? (
                    <div className={styles.coupon}>
                        <Input type="text" label="Código do Cupom" placeholder="Digite o código do cupom" name="couponCode" required={true} value={couponCode} onChange={(e) => setCouponCode(e.target.value)} maxLength={6} />

                        <div className={styles.savedCoupons}>
                            <p>Cupons disponíveis para teste:</p>
                            <div className={styles.coupons}>
                                {couponCodes.map((code) => (
                                    <ModalCoupon
                                        key={code}
                                        code={code}
                                        onSelect={(selectedCode) => setCouponCode(selectedCode.substring(0, 6))}
                                    />
                                ))}
                            </div>

                        </div>
                    </div>
                ) : (
                    <div className={styles.percent}>
                        <Input type="number" label="Porcentagem de desconto" placeholder="Ex: 15%" name="percentDiscount" required={true} value={discountPercent} onChange={(e) => setDiscountPercent(e.target.value)} />

                        <p>Digite um valor entre 1% e 99%</p>
                    </div>
                )}

                <div className={styles.buttons}>
                    <Button title="Cancelar" variant="secondary" handleFunction={onClose} />
                    <Button title="Aplicar" variant="primary" handleFunction={handleApply} />
                </div>
            </div>
        </div>
    )
}