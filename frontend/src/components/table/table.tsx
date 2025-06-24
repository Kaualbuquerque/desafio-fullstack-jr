import styles from "./table.module.scss"

import edit from "../../../public/edit.png"
import trash from "../../../public/trash-2.png"
import dollar from "../../../public/dollar-sign.png"
import Image from "next/image"

export default function Table() {
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
                    <tr className={styles.rowOdd}>
                        <td className={styles.bodyCell}>Smartphone XYZ</td>
                        <td className={styles.bodyCell}>Smartphone premium com um monte de jogos</td>
                        <td className={styles.bodyCell}>Eletrônicos</td>
                        <td className={styles.bodyCell}>R$ 1999.99</td>
                        <td className={styles.bodyCell}>50</td>
                        <td className={styles.bodyCellActions}>
                            <Image src={edit} alt="icone de edição" width={edit.width} height={edit.height} />
                            <Image src={trash} alt="icone de edição" width={trash.width} height={trash.height} />
                            <Image src={dollar} alt="icone de edição" width={dollar.width} height={dollar.height} />
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}