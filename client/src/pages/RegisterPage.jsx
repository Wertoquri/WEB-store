import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import ErrorMessage from '../components/ErrorMessage';
import { GoogleLogin } from '@react-oauth/google';
import { Check, X, Eye, EyeOff } from 'lucide-react';

const passwordRules = [
  { key: 'length', label: 'Мінімум 6 символів', test: (p) => p.length >= 6 },
  { key: 'uppercase', label: 'Хоча б одна велика літера (A-Z)', test: (p) => /[A-ZА-ЯІЇЄ]/.test(p) },
  { key: 'lowercase', label: 'Хоча б одна мала літера (a-z)', test: (p) => /[a-zа-яіїє]/.test(p) },
  { key: 'number', label: 'Хоча б одна цифра (0-9)', test: (p) => /\d/.test(p) },
  { key: 'special', label: 'Хоча б один спецсимвол (!@#$%^&*)', test: (p) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(p) },
  { key: 'noSpaces', label: 'Без пробілів', test: (p) => !/\s/.test(p) },
];

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    window.fbAsyncInit = function() {
      window.FB.init({
        appId: import.meta.env.VITE_FACEBOOK_APP_ID || 'YOUR_FACEBOOK_APP_ID',
        cookie: true,
        xfbml: true,
        version: 'v18.0'
      });
    };

    (function(d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) {return;}
      js = d.createElement(s); js.id = id;
      js.src = "https://connect.facebook.net/en_US/sdk.js";
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Паролі не співпадають');
      return;
    }

    const passedRules = passwordRules.every(rule => rule.test(formData.password));
    if (!passedRules) {
      setError('Пароль не відповідає вимогам безпеки');
      return;
    }

    setLoading(true);

    try {
      const response = await authAPI.register({
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName
      });
      login(response.data.user, response.data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Реєстрація не вдалась');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setError('');
      setLoading(true);
      const response = await authAPI.googleAuth(credentialResponse.credential);
      login(response.data.user, response.data.token);
      navigate('/');
    } catch (err) {
      const msg = err.response?.data?.error || 'Google authentication failed';
      if (msg.includes('не налаштовано')) {
        setError(msg);
      } else if (msg.includes('invalid_client') || msg.includes('401')) {
        setError('Google OAuth Client ID недійсний.');
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError('Google authentication failed');
  };

  const handleFacebookLogin = async () => {
    if (!window.FB) {
      setError('Facebook SDK не завантажено. Спробуйте оновити сторінку.');
      return;
    }
    window.FB.login(async (response) => {
      if (response.authResponse) {
        try {
          setError('');
          setLoading(true);
          const fbResponse = await authAPI.facebookAuth(response.authResponse.accessToken);
          login(fbResponse.data.user, fbResponse.data.token);
          navigate('/');
        } catch (err) {
          setError(err.response?.data?.error || 'Facebook authentication failed');
        } finally {
          setLoading(false);
        }
      }
    }, { scope: 'email' });
  };

  const passedRules = passwordRules.filter(rule => rule.test(formData.password)).length;
  const passwordStrength = formData.password.length === 0 ? 0 : (passedRules / passwordRules.length) * 100;
  const strengthColor = passwordStrength < 40 ? 'bg-red-500' : passwordStrength < 70 ? 'bg-yellow-500' : 'bg-green-500';
  const strengthLabel = passwordStrength < 40 ? 'Слабкий' : passwordStrength < 70 ? 'Середній' : 'Надійний';

  return (
    <div className="auth">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h1>Створити акаунт</h1>
            <p>Заповніть форму для реєстрації</p>
          </div>

          {error && <ErrorMessage message={error} />}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="auth-form-group grid-2">
              <div>
                <label>Ім'я</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Іван"
                />
              </div>
              <div>
                <label>Прізвище</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Петренко"
                />
              </div>
            </div>

            <div className="auth-form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
              />
            </div>

            {/* Password with rules */}
            <div className="auth-form-group">
              <label>Пароль</label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="password-toggle"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {/* Password strength bar */}
              {formData.password && (
                <div className="password-strength">
                  <div className="password-strength-bar">
                    <div className={`password-strength-fill ${strengthColor}`} style={{ width: `${passwordStrength}%` }} />
                  </div>
                  <span className={`password-strength-label ${passwordStrength < 40 ? 'text-red-500' : passwordStrength < 70 ? 'text-yellow-500' : 'text-green-500'}`}>
                    {strengthLabel} ({passedRules}/{passwordRules.length})
                  </span>
                </div>
              )}

              {/* Password rules */}
              {formData.password && (
                <div className="password-rules">
                  {passwordRules.map(rule => {
                    const passed = rule.test(formData.password);
                    return (
                      <div key={rule.key} className={`password-rule ${passed ? 'passed' : 'failed'}`}>
                        {passed ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          <X className="w-4 h-4" />
                        )}
                        <span>{rule.label}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Confirm password */}
            <div className="auth-form-group">
              <label>Підтвердження паролю</label>
              <div className="password-input-wrapper">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="password-toggle"
                >
                  {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                <p className="password-mismatch">Паролі не співпадають</p>
              )}
              {formData.confirmPassword && formData.password === formData.confirmPassword && (
                <p className="password-match">Паролі співпадають</p>
              )}
            </div>

            <button type="submit" disabled={loading} className="auth-submit-btn">
              {loading ? 'Створення...' : 'Зареєструватися'}
            </button>
          </form>

          <div className="auth-divider">
            <span>або зареєструйтесь через</span>
          </div>

          <div className="social-login-buttons">
            {import.meta.env.VITE_GOOGLE_CLIENT_ID && import.meta.env.VITE_GOOGLE_CLIENT_ID !== 'YOUR_GOOGLE_CLIENT_ID' ? (
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                useOneTap
                locale="uk"
                width="100%"
              />
            ) : (
              <div className="text-center p-3 rounded-lg bg-gray-50 border border-gray-200">
                <p className="text-sm text-gray-500">Google вхід недоступний</p>
                <p className="text-xs text-gray-400 mt-1">Налаштуйте Google OAuth в .env</p>
              </div>
            )}

            <button
              onClick={handleFacebookLogin}
              disabled={loading}
              className="facebook-login-btn"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              Продовжити через Facebook
            </button>
          </div>

          <div className="auth-footer">
            <p>
              Вже маєте акаунт?{' '}
              <Link to="/login">Увійти</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
