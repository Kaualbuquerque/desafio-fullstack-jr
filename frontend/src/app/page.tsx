'use client';

import Image from "next/image";
import produtos from "../../public/shopping-bag.png"
import refresh from "../../public/refresh-cw.png"

import styles from "./page.module.scss"
import Input from "@/components/input/input";
import Button from "@/components/button/button";
import Table from "@/components/table/table";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Product} from "@/services/productService";
import { api } from "@/services/api";

export default function Home() {

  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [isFiltering, setIsFiltering] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const clearFilters = () => {
    setMinPrice("");
    setMaxPrice("");
    setSearchTerm("");
    setProducts(allProducts);
    setIsFiltering(false);
  };

  const handleCreateFunction = () => {
    router.push('/product/create')
  }

  const handleUpdateFunction = (id: number) => {
    router.push(`/product/update/${id}`)
  }

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await api.get('/products');
        const extractedProducts = response.data.data.map((item: any) => ({
          ...item.product,
          discountPrice: item.finalPrice,
        }));

        setAllProducts(extractedProducts);
        setProducts(extractedProducts);
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
      }
    }

    fetchProducts();
  }, []);

  const handleDeleteProduct = async (id: number) => {
    try {
      await api.delete(`/products/${id}`);
      setProducts((prev) => prev.filter((p) => p.id !== id)); // remove da UI
      alert("Produto deletado com sucesso!");
    } catch (error) {
      console.error("Erro ao deletar produto:", error);
      alert("Erro ao deletar produto.");
    }
  };

  const handleFilter = () => {
    let filtered = [...allProducts];

    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (minPrice) {
      filtered = filtered.filter(product =>
        (product.discountPrice ?? product.price) >= parseFloat(minPrice)
      );
    }

    if (maxPrice) {
      filtered = filtered.filter(product =>
        (product.discountPrice ?? product.price) <= parseFloat(maxPrice)
      );
    }

    setProducts(filtered);
    setIsFiltering(true);
  };

  return (
    <div className={styles.page}>
      <div>
        <h1 className={styles.title}> <Image src={produtos} alt="icone de produtos" width={produtos.width} height={produtos.height} />Produtos</h1>
      </div>
      <div className={styles.inputs}>
        <div className={styles.filters}>
          <Input type="number" name="minPrice" label="Preço mínimo" placeholder="R$ 0,00" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} />
          <Input type="number" name="maxPrice" label="Preço máximo" placeholder="R$ 999,99" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
          {isFiltering ? (
            <Button title="Limpar filtros" variant="clearFilters" handleFunction={clearFilters} icon={refresh}/>
          ) : (
            <Button title="Filtrar" variant="primary" handleFunction={handleFilter} />
          )}
        </div>

        <div className={styles.newProduct}>
          <Input type="text" name="searchProduct" placeholder="Buscar produto..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          <Button title="+ Criar produto" variant="primary" handleFunction={handleCreateFunction} />
        </div>
      </div>

      <div className={styles.table}>
        <Table products={products} onDelete={handleDeleteProduct} onUpdate={handleUpdateFunction} />
      </div>
    </div>
  );
}
