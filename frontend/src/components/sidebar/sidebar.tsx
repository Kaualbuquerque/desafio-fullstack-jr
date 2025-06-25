import styles from "./sidebar.module.scss"

import Image from "next/image"

import dashboard from "../../../public/home.png"
import produtos from "../../../public/shopping-bag-sidebar.png"
import relatorio from "../../../public/file-text.png"
import administracao from "../../../public/settings.png"
import logout from "../../../public/log-out.png"

export default function Sidebar() {
    return (
        <>
            <section className={styles.sidebar}>
                <div className={styles.logo}>
                    <p>grupo<span>a</span></p>
                </div>

                <div className={styles.menu}>
                    <ul>
                        <li><Image src={dashboard} alt="icone de dashboard" width={dashboard.width} height={dashboard.height} /><span>Dashboard</span></li>
                        <li><Image src={produtos} alt="icone de produtos" width={produtos.width} height={produtos.height} /><span>Produtos</span></li>
                        <li><Image src={relatorio} alt="icone de relatorio" width={relatorio.width} height={relatorio.height} /><span>Relatórios</span></li>
                        <li><Image src={administracao} alt="icone de administracao" width={administracao.width} height={administracao.height} /><span>Administração</span></li>
                    </ul>
                </div>

                <div className={styles.logout}>
                    <Image src={logout} alt="icone de logout" width={logout.width} height={logout.height} />
                    <p>Sair</p>
                </div>
            </section>
        </>
    )
}