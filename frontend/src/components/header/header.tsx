import styles from "./header.module.scss"

export default function Header() {
    return (
        <>
            <section className={styles.header}>
                <div className={styles.circle}>AM</div>
                <p>Arthur Morgan</p>
            </section>
        </>
    )
}