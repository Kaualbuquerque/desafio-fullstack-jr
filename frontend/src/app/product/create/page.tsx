import Input from "@/components/input/input"
import file from "../../../../public/file-plus-2.png"
import styles from "./page.module.scss"
import Button from "@/components/button/button"
import Table from "@/components/table/table"
import Image from "next/image"
import ProductForm from "@/components/product-form/product-form"

export default function createProduct() {
    return (
        <div className={styles.page}>
            <div className={styles.title}>
                <Image src={file} alt="icone de file" width={file.width} height={file.height} />
                <h1>Cadastro de Produtos</h1>
            </div>
            <div className={styles.productForm}>
                <ProductForm />
            </div>
        </div>
    )
}