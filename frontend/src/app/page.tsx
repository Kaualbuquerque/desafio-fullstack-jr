import Image from "next/image";
import produtos from "../../public/shopping-bag.png"

import styles from "./page.module.scss"
import Input from "@/components/input/input";
import Button from "@/components/button/button";
import Table from "@/components/table/table";

export default function Home() {

  return (
    <div className={styles.page}>
      <div>
        <h1 className={styles.title}> <Image src={produtos} alt="icone de produtos" width={produtos.width} height={produtos.height} />Produtos</h1>
      </div>
      <div className={styles.inputs}>
        <div className={styles.filters}>
          <Input type="number" name="minPrice" label="Preço mínimo" placeholder="R$ 0,00" />
          <Input type="number" name="maxPrice" label="Preço máximo" placeholder="R$ 999,99" />
          <Button title="Filtrar" />
        </div>

        <div className={styles.newProduct}>
          <Input type="text" name="searchProduct" placeholder="Buscar produto..." />
          <Button title="+ Criar produto" />
        </div>
      </div>

      <div className={styles.table}>
        <Table />
      </div>
    </div>
  );
}
