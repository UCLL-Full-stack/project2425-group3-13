import { User } from "@/types";
import styles from '@/styles/Home.module.css';
import { useTranslation } from "next-i18next";

type Props = {
    user: User;
    handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
    handleInputChange: (field: keyof User, value: any) => void;
    errors: {
        nationalRegisterNumber?: string;
        name?: string;
        birthDate?: string;
        phoneNumber?: string;
        email?: string;
        password?: string;
    };
}

const RegisterForm: React.FC<Props> = ({ user, handleSubmit, handleInputChange, errors }: Props) => {
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
            {errors.nationalRegisterNumber && <p className={styles.error}>{errors.nationalRegisterNumber}</p>}

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
            {errors.name && <p className={styles.error}>{errors.name}</p>}

            <label htmlFor="birthDate">{t("userDetails.birthDate")}<sup>*</sup></label>
            <input 
                type="date"
                id="birthDate"
                name="birthDate"
                value={birthDate.toISOString().split("T")[0]} 
                onChange={(e) => handleInputChange("birthDate", e.target.value)}
                required
            />
            {errors.birthDate && <p className={styles.error}>{errors.birthDate}</p>}

            <label htmlFor="role">{t("userDetails.role")} <sup>*</sup></label>
            <select
                id="role"
                name="role"
                value={user.role}
                onChange={(e) => handleInputChange("role", e.target.value)}
                required
            >
                <option value="user">{t("userDetails.user")}</option>
                <option value="admin">{t("userDetails.admin")}</option>
                <option value="bank">{t("userDetails.bank")}</option>
            </select>

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
            {errors.phoneNumber && <p className={styles.error}>{errors.phoneNumber}</p>}


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
            {errors.email && <p className={styles.error}>{errors.email}</p>}

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
            {errors.password && <p className={styles.error}>{errors.password}</p>}
            
            <button type="submit">{t("submit.register")}</button>
        </form>
    );
};

export default RegisterForm;