'use client';

import styles from "./product-form.module.scss"

import Input from "../input/input";
import Select from "../select/select";
import Button from "../button/button";
import { useRouter } from "next/navigation";
import { createProduct } from "@/services/productService";

export default function ProductForm() {
    const categories = ['Eletrônicos', 'Roupas', 'Livros', 'Alimentos'];
    const router = useRouter()

    const handleCancelForm = (e: React.SyntheticEvent) => {
        e.preventDefault();
        router.push('/');
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);

        const newProduct = {
            name: formData.get('productName') as string,
            category: formData.get('selectCategory') as string,
            description: formData.get('productDescription') as string,
            price: parseFloat(formData.get('productPrice') as string),
            stock: parseInt(formData.get('productStock') as string, 10),
        }

        try {
            await createProduct(newProduct);
            alert('Produto criado com sucesso!');
            router.push('/');
        } catch (error: any) {
            console.error('Erro ao criar produto:', error);

            // Tenta extrair uma mensagem mais específica do erro
            const errorMessage =
                error?.response?.data?.message ||
                error?.message ||
                'Erro ao cadastrar o produto.';

            alert(`Erro ao cadastrar o produto: ${errorMessage}`);
        }
    }

    return (
        <div>
            <form onSubmit={handleSubmit} className={styles.productForm}>
                <div className={styles.title}>
                    <h2>Dados do produto <span>| O campo abaixo é obrigatório para o cadastro.</span></h2>
                </div>
                <div className={styles.formInputs}>
                    <div className={styles.nameCategoryInput}>
                        <Input type="text" name="productName" placeholder="Informe o nome do produto" label="Nome do produto *" required={true} />
                        <Select name="selectCategory" label="Categoria *" options={categories} required={true} />
                    </div>

                    <div className={styles.descriptionInput}>
                        <Input type="textarea" name="productDescription" placeholder="Descrição detalhada do produto" label="Descrição *" required={true} />
                    </div>

                    <div className={styles.priceStockInput}>
                        <Input type="number" name="productPrice" placeholder="R$ 0,00" label="Preço *" required={true} />
                        <Input type="number" name="productStock" placeholder="0" label="Estoque *" required={true} />
                    </div>

                    <div className={styles.formButton}>
                        <Button title="Cancelar" variant="secondary" handleFunction={handleCancelForm} />
                        <Button title="Cadastrar" variant="primary" />
                    </div>
                </div>
            </form>
        </div>
    )
}