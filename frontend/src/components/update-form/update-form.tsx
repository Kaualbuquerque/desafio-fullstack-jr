'use client';

import styles from "./update-form.module.scss"

import Input from "../input/input";
import Select from "../select/select";
import Button from "../button/button";
import { useParams, useRouter } from "next/navigation";
import { createProduct, getProductById, updateProduct } from "@/services/productService";
import { useEffect, useState } from "react";

export default function UpdateForm() {
    const router = useRouter()
    const { id } = useParams(); // obtém o id da URL
    const categories = ['Eletrônicos', 'Roupas', 'Livros', 'Alimentos'];
    const [isActive, setIsActive] = useState(true); // Produto está ativo por padrão
    const [formData, setFormData] = useState({
        productName: "",
        selectCategory: "",
        productDescription: "",
        productPrice: "",
        productStock: "",
    });

    useEffect(() => {
        async function fetchProduct() {
            try {
                const response = await getProductById(Number(id));
                const product = response.product;

                setFormData({
                    productName: product.name,
                    selectCategory: product.category,
                    productDescription: product.description,
                    productPrice: String(product.price),
                    productStock: String(product.stock),
                });

                setIsActive(!product.deleted_at); // Ativo se não estiver deletado
            } catch (err) {
                alert("Erro ao buscar produto para edição.");
                router.push('/');
            }
        }

        fetchProduct();
    }, [id, router]);


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCancelForm = (e: React.SyntheticEvent) => {
        e.preventDefault();
        router.push('/');
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            await updateProduct(Number(id), {
                name: formData.productName,
                category: formData.selectCategory,
                description: formData.productDescription,
                price: parseFloat(formData.productPrice),
                stock: parseInt(formData.productStock, 10),
            });
            alert("Produto atualizado com sucesso!");
            router.push('/');
        } catch (err) {
            alert("Erro ao atualizar produto.");
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit} className={styles.productForm}>
                <div className={styles.title}>
                    <h2>Dados do produto <span>| O campo abaixo é obrigatório para o cadastro.</span></h2>
                </div>
                <div className={styles.formInputs}>
                    <div className={styles.nameCategoryInput}>
                        <Input
                            type="text"
                            name="productName"
                            placeholder="Informe o nome do produto"
                            label="Nome do produto *"
                            required={true}
                            value={formData.productName || ""}
                            onChange={handleChange}
                        />
                        <Select name="selectCategory" label="Categoria *" options={categories} required={true} value={formData.selectCategory} onChange={handleChange} />
                    </div>

                    <div className={styles.descriptionInput}>
                        <Input
                            type="textarea"
                            name="productDescription"
                            placeholder="Descrição detalhada do produto"
                            label="Descrição *"
                            required={true}
                            value={formData.productDescription || ""}
                            onChange={handleChange}
                        />
                    </div>

                    <div className={styles.priceStockInput}>
                        <Input
                            type="number"
                            name="productPrice"
                            placeholder="R$ 0,00"
                            label="Preço *"
                            required={true}
                            value={formData.productPrice || ""}
                            onChange={handleChange}
                        />
                        <Input
                            type="number"
                            name="productStock"
                            placeholder="0"
                            label="Estoque *"
                            required={true}
                            value={formData.productStock || ""}
                            onChange={handleChange}
                        />
                    </div>

                    <div className={styles.formButton}>
                        <Button title="Cancelar" variant="secondary" handleFunction={handleCancelForm} />
                        <Button title="Salvar alterações" variant="primary" />
                    </div>
                </div>
            </form>
        </div>
    )
}