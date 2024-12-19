import styles from '@/styles/Home.module.css';
import { useTranslation } from 'next-i18next';

const Footer: React.FC = () => {
  const { t } = useTranslation();

  return (
    <footer className={styles.footer}>
        <section>
            <h1>{t("footer.contactUs")}</h1>
            <ul>
                <li>Email Ivan Jiang: <a href="mailto:ivan.jiang@student.ucll.be">ivan.jiang@student.ucll.be</a></li>
                <li>Email Timothy De Jaeger: <a href="mailto:timothy.dejaeger@student.ucll.be">timothy.dejaeger@student.ucll.be</a></li>
            </ul>
        </section>
        <p>
            &copy; Copyright 2024 - Ivan Jiang - Timothy De Jaeger
        </p>
    </footer>
  );
};

export default Footer;
