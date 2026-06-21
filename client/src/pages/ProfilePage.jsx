import { useEffect, useState } from 'react';
import {
  CalendarDays,
  CheckCircle2,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  MapPin,
  Phone,
  Save,
  ShieldCheck,
  User,
} from 'lucide-react';
import { authAPI } from '../services/api';
import { cn } from '../components/ui/utils';
import { useAuth } from '../context/AuthContext';

const pageShellClass = 'mx-auto w-full max-w-[1380px] px-4 py-8 sm:px-6 lg:px-8';
const surfaceClass = 'rounded-lg border border-white/55 bg-white/72 shadow-[var(--shadow-soft)] backdrop-blur-sm';
const fieldGridClass = 'grid gap-4 md:grid-cols-2';
const labelClass = 'mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--ink-muted)]';
const inputClass =
  'h-12 w-full rounded-lg border border-[var(--line-soft)] bg-white px-4 text-sm text-[var(--ink-strong)] outline-none transition focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand-soft)] disabled:cursor-not-allowed disabled:bg-[var(--sand)]/45 disabled:text-[var(--ink-muted)]';
const sectionDividerClass = 'border-t border-[var(--line-soft)] pt-8';
const secondaryButtonClass =
  'inline-flex h-11 items-center justify-center rounded-full border border-[var(--line-soft)] bg-white px-5 text-sm font-semibold text-[var(--ink-strong)] transition hover:border-[var(--brand)]/40 hover:text-[var(--brand)]';
const primaryButtonClass =
  'inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[linear-gradient(135deg,var(--brand)_0%,var(--accent)_100%)] px-5 text-sm font-semibold text-white shadow-[0_18px_34px_-24px_rgba(255,107,74,0.9)] transition hover:translate-y-[-1px] disabled:cursor-not-allowed disabled:opacity-60';

const Notice = ({ tone, message }) => {
  if (!message) {
    return null;
  }

  return (
    <div
      className={cn(
        'rounded-lg border px-4 py-3 text-sm',
        tone === 'success'
          ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
          : 'border-rose-200 bg-rose-50 text-rose-700'
      )}
    >
      {message}
    </div>
  );
};

const ProfileField = ({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  disabled = false,
  className,
}) => (
  <label className={className}>
    <span className={labelClass}>{label}</span>
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      className={inputClass}
    />
  </label>
);

const PasswordField = ({
  label,
  value,
  onChange,
  visible,
  onToggle,
  placeholder,
}) => (
  <label>
    <span className={labelClass}>{label}</span>
    <div className="relative">
      <input
        type={visible ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required
        minLength={6}
        className={cn(inputClass, 'pr-14')}
      />
      <button
        type="button"
        onClick={onToggle}
        className="absolute right-3 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full text-[var(--ink-muted)] transition hover:bg-[var(--brand-soft)] hover:text-[var(--brand)]"
        aria-label={visible ? 'Приховати пароль' : 'Показати пароль'}
      >
        {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  </label>
);

const ProfilePage = () => {
  const { user, updateUserData } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipCode: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      return;
    }

    setFormData({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email || '',
      phone: user.phone || '',
      address: user.address || '',
      city: user.city || '',
      zipCode: user.zipCode || '',
    });
  }, [user]);

  const handleFieldChange = (field) => (event) => {
    setFormData((current) => ({
      ...current,
      [field]: event.target.value,
    }));
  };

  const handlePasswordFieldChange = (field) => (event) => {
    setPasswordData((current) => ({
      ...current,
      [field]: event.target.value,
    }));
  };

  const resetPasswordForm = (clearMessages = true) => {
    setShowPasswordForm(false);
    setShowCurrentPw(false);
    setShowNewPw(false);
    setShowConfirmPw(false);
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });

    if (clearMessages) {
      setPasswordError('');
      setPasswordSuccess('');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await authAPI.updateProfile(formData);
      updateUserData(response.data.user);
      setSuccess('Профіль успішно оновлено.');
    } catch (requestError) {
      setError(requestError.response?.data?.error || 'Не вдалося оновити профіль.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (event) => {
    event.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('Нові паролі не співпадають.');
      return;
    }

    setPasswordLoading(true);

    try {
      await authAPI.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      setPasswordSuccess('Пароль успішно змінено.');
      setPasswordError('');
      resetPasswordForm(false);
    } catch (requestError) {
      setPasswordError(requestError.response?.data?.error || 'Не вдалося змінити пароль.');
    } finally {
      setPasswordLoading(false);
    }
  };

  const getInitials = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }

    return user?.email?.[0]?.toUpperCase() || 'U';
  };

  const completedFields = [
    formData.firstName,
    formData.lastName,
    formData.phone,
    formData.address,
    formData.city,
    formData.zipCode,
  ].filter(Boolean).length;

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('uk-UA', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      })
    : 'Недавно';

  const profileName = [formData.firstName, formData.lastName].filter(Boolean).join(' ') || 'Ваш акаунт';
  const shippingSummary = [formData.city, formData.address].filter(Boolean).join(', ') || 'Додайте адресу доставки';

  if (!user) {
    return null;
  }

  return (
    <div className={pageShellClass}>
      <section className="rounded-lg border border-white/45 bg-[linear-gradient(135deg,rgba(255,255,255,0.82)_0%,rgba(245,237,230,0.9)_52%,rgba(255,255,255,0.72)_100%)] px-6 py-8 shadow-[var(--shadow-soft)] sm:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--ink-muted)]">
              Account center
            </p>
            <h1 className="mt-3 font-display text-4xl font-semibold tracking-[-0.05em] text-[var(--ink-strong)] sm:text-5xl">
              Мій кабінет
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--ink-soft)] sm:text-base">
              Керуйте особистими даними, доставкою та безпекою акаунта в одному спокійному робочому просторі.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-[rgba(126,231,207,0.36)] bg-[rgba(126,231,207,0.14)] px-4 py-2 text-sm font-medium text-[var(--ink-strong)]">
              <ShieldCheck className="h-4 w-4 text-[var(--brand)]" />
              {user.role === 'admin' ? 'Адміністратор' : 'Особистий акаунт'}
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-[var(--line-soft)] bg-white/80 px-4 py-2 text-sm font-medium text-[var(--ink-strong)]">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              Заповнено {completedFields}/6 полів
            </span>
          </div>
        </div>
      </section>

      <div className="mt-6 grid gap-6 xl:grid-cols-[320px,1fr]">
        <aside className={cn(surfaceClass, 'p-6 sm:p-7')}>
          <div className="flex items-center gap-4">
            <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-[linear-gradient(135deg,var(--brand)_0%,var(--accent)_100%)] text-2xl font-semibold text-white shadow-[0_20px_36px_-26px_rgba(255,107,74,0.9)]">
              {getInitials()}
            </div>
            <div className="min-w-0">
              <p className="font-display text-3xl font-semibold tracking-[-0.04em] text-[var(--ink-strong)]">
                {profileName}
              </p>
              <p className="mt-1 truncate text-sm text-[var(--ink-soft)]">{formData.email}</p>
            </div>
          </div>

          <div className="mt-6 grid gap-3">
            <div className="rounded-lg border border-[var(--line-soft)] bg-white/70 px-4 py-3">
              <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--ink-muted)]">
                <CalendarDays className="h-4 w-4" />
                У системі
              </div>
              <p className="mt-2 text-sm font-medium text-[var(--ink-strong)]">{memberSince}</p>
            </div>
            <div className="rounded-lg border border-[var(--line-soft)] bg-white/70 px-4 py-3">
              <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--ink-muted)]">
                <MapPin className="h-4 w-4" />
                Доставка
              </div>
              <p className="mt-2 text-sm font-medium text-[var(--ink-strong)]">{shippingSummary}</p>
            </div>
          </div>

          <div className={cn(sectionDividerClass, 'mt-6')}>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--ink-muted)]">
              Контакти
            </p>
            <div className="mt-4 space-y-3">
              <div className="flex items-start gap-3 text-sm text-[var(--ink-soft)]">
                <Mail className="mt-0.5 h-4 w-4 text-[var(--brand)]" />
                <span className="break-words">{formData.email}</span>
              </div>
              <div className="flex items-start gap-3 text-sm text-[var(--ink-soft)]">
                <Phone className="mt-0.5 h-4 w-4 text-[var(--brand)]" />
                <span>{formData.phone || 'Додайте номер телефону'}</span>
              </div>
              <div className="flex items-start gap-3 text-sm text-[var(--ink-soft)]">
                <MapPin className="mt-0.5 h-4 w-4 text-[var(--brand)]" />
                <span>{shippingSummary}</span>
              </div>
            </div>
          </div>
        </aside>

        <section className={cn(surfaceClass, 'p-6 sm:p-7')}>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--ink-muted)]">
                  Profile settings
                </p>
                <h2 className="mt-3 font-display text-3xl font-semibold tracking-[-0.04em] text-[var(--ink-strong)]">
                  Особисті дані
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--ink-soft)]">
                  Оновіть інформацію, яку бачить служба доставки та команда підтримки.
                </p>
              </div>

              <button type="submit" disabled={loading} className={primaryButtonClass}>
                <Save className="h-4 w-4" />
                {loading ? 'Зберігаємо...' : 'Зберегти зміни'}
              </button>
            </div>

            <div className="mt-6 space-y-3">
              <Notice tone="error" message={error} />
              <Notice tone="success" message={success} />
            </div>

            <div className={cn(fieldGridClass, 'mt-8')}>
              <ProfileField
                label="Ім’я"
                value={formData.firstName}
                onChange={handleFieldChange('firstName')}
                placeholder="Іван"
              />
              <ProfileField
                label="Прізвище"
                value={formData.lastName}
                onChange={handleFieldChange('lastName')}
                placeholder="Петренко"
              />
              <ProfileField
                label="Email"
                type="email"
                value={formData.email}
                disabled
                className="md:col-span-2"
              />
              <ProfileField
                label="Телефон"
                type="tel"
                value={formData.phone}
                onChange={handleFieldChange('phone')}
                placeholder="+380XXXXXXXXX"
                className="md:col-span-2"
              />
            </div>

            <div className={cn(sectionDividerClass, 'mt-8')}>
              <div className="flex items-start gap-3">
                <MapPin className="mt-1 h-5 w-5 text-[var(--brand)]" />
                <div>
                  <h3 className="font-display text-2xl font-semibold tracking-[-0.04em] text-[var(--ink-strong)]">
                    Адреса доставки
                  </h3>
                  <p className="mt-2 text-sm leading-7 text-[var(--ink-soft)]">
                    Ці дані використовуються для оформлення замовлень і швидшого повторного чекауту.
                  </p>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <ProfileField
                  label="Вулиця, будинок, квартира"
                  value={formData.address}
                  onChange={handleFieldChange('address')}
                  placeholder="вул. Хрещатик, 1, кв. 10"
                />
                <div className={fieldGridClass}>
                  <ProfileField
                    label="Місто"
                    value={formData.city}
                    onChange={handleFieldChange('city')}
                    placeholder="Київ"
                  />
                  <ProfileField
                    label="Індекс"
                    value={formData.zipCode}
                    onChange={handleFieldChange('zipCode')}
                    placeholder="01001"
                  />
                </div>
              </div>
            </div>
          </form>

          <div className={cn(sectionDividerClass, 'mt-8')}>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <LockKeyhole className="mt-1 h-5 w-5 text-[var(--brand)]" />
                <div>
                  <h3 className="font-display text-2xl font-semibold tracking-[-0.04em] text-[var(--ink-strong)]">
                    Безпека
                  </h3>
                  <p className="mt-2 text-sm leading-7 text-[var(--ink-soft)]">
                    Змініть пароль, якщо хочете оновити доступ до акаунта.
                  </p>
                </div>
              </div>

              {!showPasswordForm ? (
                <button
                  type="button"
                  onClick={() => {
                    setPasswordError('');
                    setPasswordSuccess('');
                    setShowPasswordForm(true);
                  }}
                  className={secondaryButtonClass}
                >
                  Змінити пароль
                </button>
              ) : null}
            </div>

            <div className="mt-6 space-y-3">
              <Notice tone="error" message={passwordError} />
              <Notice tone="success" message={passwordSuccess} />
            </div>

            {showPasswordForm ? (
              <form onSubmit={handlePasswordChange} className="mt-6 space-y-4">
                <PasswordField
                  label="Поточний пароль"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordFieldChange('currentPassword')}
                  visible={showCurrentPw}
                  onToggle={() => setShowCurrentPw((current) => !current)}
                  placeholder="Введіть поточний пароль"
                />

                <div className={fieldGridClass}>
                  <PasswordField
                    label="Новий пароль"
                    value={passwordData.newPassword}
                    onChange={handlePasswordFieldChange('newPassword')}
                    visible={showNewPw}
                    onToggle={() => setShowNewPw((current) => !current)}
                    placeholder="Не менше 6 символів"
                  />
                  <PasswordField
                    label="Підтвердження пароля"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordFieldChange('confirmPassword')}
                    visible={showConfirmPw}
                    onToggle={() => setShowConfirmPw((current) => !current)}
                    placeholder="Повторіть новий пароль"
                  />
                </div>

                <div className="flex flex-wrap gap-3">
                  <button type="submit" disabled={passwordLoading} className={primaryButtonClass}>
                    <LockKeyhole className="h-4 w-4" />
                    {passwordLoading ? 'Оновлюємо...' : 'Оновити пароль'}
                  </button>
                  <button type="button" onClick={resetPasswordForm} className={secondaryButtonClass}>
                    Скасувати
                  </button>
                </div>
              </form>
            ) : (
              <div className="mt-6 flex items-center gap-3 rounded-lg border border-dashed border-[var(--line-soft)] bg-white/45 px-4 py-4 text-sm text-[var(--ink-soft)]">
                <User className="h-4 w-4 text-[var(--brand)]" />
                Пароль прихований і не змінюється, доки ви не відкриєте форму редагування.
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default ProfilePage;
