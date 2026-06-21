import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import ErrorMessage from '../components/ErrorMessage';
import { GoogleLogin } from '@react-oauth/google';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Load Facebook SDK
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
    setLoading(true);

    try {
      const response = await authAPI.login(email, password);
      login(response.data.user, response.data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Помилка входу');
    } finally {
      setLoading(false);
    }
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
        setError('Google OAuth Client ID недійсний. Перевірте налаштування в Google Cloud Console.');
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

  const handleFacebookLogin = () => {
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
      } else {
        setError('Facebook login cancelled');
      }
    }, { scope: 'email' });
  };

  return (
    <div className="auth">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h1>З поверненням!</h1>
            <p>Увійдіть до свого акаунту</p>
          </div>

          {error && <ErrorMessage message={error} />}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="auth-form-group">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>

            <div className="auth-form-group">
              <label>Пароль</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            <button type="submit" disabled={loading} className="auth-submit-btn">
              {loading ? 'Вхід...' : 'Увійти'}
            </button>
          </form>

          <div className="auth-divider">
            <span>або увійдіть через</span>
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
              Немає акаунту?{' '}
              <Link to="/register">Зареєструватися</Link>
            </p>
          </div>

          <div className="auth-hint">
            <p>Тестовий акаунт: user@example.com / user123</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
