import styles from "./table.module.scss"

import edit from "../../../public/edit.png"
import trash from "../../../public/trash-2.png"
import dollar from "../../../public/dollar-sign.png"
import Image from "next/image"
import { Product } from "@/services/productService"
import { useState } from "react"
import Modal from "../modal/modal"

interface TableProps {
    products: Product[];
    onDelete: (id: number) => void;
    onUpdate: (id: number) => void;
}

export default function Table({ products, onDelete, onUpdate }: TableProps) {
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    const openModal = (product: Product) => {
        setSelectedProduct(product);
    };

    const closeModal = () => {
        setSelectedProduct(null);
    };
    return (
        <div>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th className={styles.headerCell}>Nome</th>
                        <th className={styles.headerCell}>Descrição</th>
                        <th className={styles.headerCell}>Categoria</th>
                        <th className={styles.headerCell}>Preço</th>
                        <th className={styles.headerCell}>Estoque</th>
                        <th className={styles.headerCell}>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((p) => (
                        <tr key={p.id} >
                            <td className={styles.bodyCell}>{p.name}</td>
                            <td className={styles.bodyCell}>{p.description}</td>
                            <td className={styles.bodyCell}>{p.category}</td>
                            <td className={styles.bodyCell}>
                                <div className={styles.priceContainer}>
                                    <div className={styles.priceStack}>
                                        <span
                                            className={`${styles.originalPrice} ${p.discountPrice && p.discountPrice < p.price ? styles.discounted : ""
                                                }`}
                                        >
                                            R$ {p.price.toFixed(2)}
                                        </span>
                                        {p.discountPrice && p.discountPrice < p.price && (
                                            <span className={styles.discountPrice}>
                                                R$ {p.discountPrice.toFixed(2)}
                                            </span>
                                        )}
                                    </div>
                                    {p.discountPrice && p.discountPrice < p.price && (
                                        <div className={styles.discountBadge}>
                                            -{Math.round(((p.price - p.discountPrice) / p.price) * 100)}%
                                        </div>
                                    )}
                                </div>
                            </td>
                            <td className={styles.bodyCell}>{p.stock}</td>
                            <td className={styles.bodyCellActions}>
                                <Image src={edit} alt="Editar" width={20} height={20} onClick={() => onUpdate(p.id!)} style={{ cursor: "pointer" }} />
                                <Image src={trash} alt="Excluir" width={20} height={20} onClick={() => onDelete(p.id!)} style={{ cursor: "pointer" }} />
                                <Image src={dollar} alt="Cupom" width={20} height={20} onClick={() => openModal(p)} style={{ cursor: "pointer" }} />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {selectedProduct ? (
                <Modal isOpen={true} onClose={closeModal} id={selectedProduct.id!} />
            ) : null}
        </div>
    )
}