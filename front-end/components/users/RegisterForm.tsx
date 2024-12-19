import { User } from "@/types";
import styles from '@/styles/Home.module.css';
import { useTranslation } from "next-i18next";

type Props = {
    user: User;
    handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
    handleInputChange: (field: keyof User, value: any) => void;
}

const RegisterForm: React.FC<Props> = ({ user, handleSubmit, handleInputChange }: Props) => {
    const { t } = useTranslation();
    const birthDate = user.birthDate ? (user.birthDate instanceof Date ? user.birthDate : new Date(user.birthDate)) : new Date();
    
    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <label htmlFor="nationalRegisterNumber">{t("userDetails.nationalRegisterNumber")}<sup>*</sup></label>
            <input 
                type="text"
                id="nationalRegisterNumber"
                name="nationalRegisterNumber"
                value={user.nationalRegisterNumber}
                onChange={(e) => handleInputChange("nationalRegisterNumber", e.target.value)}
                placeholder={t("userDetails.nationalRegisterNumber")}
                required
            />

            <label htmlFor="name">{t("userDetails.name")}<sup>*</sup></label>
            <input 
                type="text"
                id="name"
                name="name"
                value={user.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder={t("userDetails.name")}
                required
            />

            <label htmlFor="birthDate">{t("userDetails.birthDate")}<sup>*</sup></label>
            <input 
                type="date"
                id="birthDate"
                name="birthDate"
                value={birthDate.toISOString().split("T")[0]} 
                onChange={(e) => handleInputChange("birthDate", e.target.value)}
                required
            />

            <label htmlFor="isAdministrator">Is Administrator <sup>*</sup></label>
            <input 
                type="checkbox"
                id="isAdministrator"
                name="isAdministrator"
                checked={user.isAdministrator}
                onChange={(e) => handleInputChange("isAdministrator", e.target.checked)}
            />

            <label htmlFor="phoneNumber">{t("userDetails.phoneNumber")}<sup>*</sup></label>
            <input 
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={user.phoneNumber}
                onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                placeholder={t("userDetails.phoneNumber")}
                required
            />

            <label htmlFor="email">Email <sup>*</sup></label>
            <input 
                type="email"
                id="email"
                name="email"
                value={user.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="Email"
                autoComplete="email"
                required
            />

            <label htmlFor="password">{t("userDetails.password")}<sup>*</sup></label>
            <input 
                type="password"
                id="password"
                name="password"
                value={user.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                placeholder={t("userDetails.password")}
                autoComplete="new-password"
                required
            />

            <button type="submit">{t("submit.register")}</button>
        </form>
    );
};

export default RegisterForm;