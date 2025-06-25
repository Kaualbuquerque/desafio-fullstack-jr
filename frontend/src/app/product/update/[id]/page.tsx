import file from "../../../../../public/file-plus-2.png"
import styles from "./page.module.scss"
import Image from "next/image"
import ProductForm from "@/components/product-form/product-form"
import UpdateForm from "@/components/update-form/update-form"

export default function updateProduct() {
    return (
        <div className={styles.page}>
            <div className={styles.title}>
                <Image src={file} alt="icone de file" width={file.width} height={file.height} />
                <h1>Editar de Produtos</h1>
            </div>
            <div className={styles.productForm}>
                <UpdateForm />
            </div>
        </div>
    )
}