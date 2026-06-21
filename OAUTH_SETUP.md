# OAuth Setup Guide

This application supports Google and Facebook OAuth registration.

## Google OAuth Setup

### 1. Create Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **Google+ API**

### 2. Create OAuth 2.0 Credentials
1. Go to **APIs & Services** > **Credentials**
2. Click **Create Credentials** > **OAuth client ID**
3. Choose **Web application**
4. Add authorized JavaScript origins:
   - `http://localhost:5173` (for local development)
5. Add authorized redirect URIs:
   - `http://localhost:5173` (for local development)
6. Click **Create**
7. Copy your **Client ID**

### 3. Configure Environment Variables

**Client (.env):**
```
VITE_GOOGLE_CLIENT_ID=your-google-client-id-here.apps.googleusercontent.com
```

**Server (.env):**
```
GOOGLE_CLIENT_ID=your-google-client-id-here.apps.googleusercontent.com
```

## Facebook OAuth Setup

### 1. Create Facebook App
1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Click **My Apps** > **Create App**
3. Select **Consumer** as the app type
4. Fill in the app details and create it

### 2. Configure Facebook Login
1. In your app dashboard, add **Facebook Login** product
2. Configure the following settings:
   - **Valid OAuth Redirect URIs**: `http://localhost:5173`
   - **Client OAuth Login**: Enabled
   - **Embedded Browser OAuth Login**: Enabled

### 3. Get App ID
1. Go to **Settings** > **Basic**
2. Copy your **App ID**

### 4. Configure Environment Variables

**Client (.env):**
```
VITE_FACEBOOK_APP_ID=your-facebook-app-id-here
```

## Testing Without OAuth

The application will still work with placeholder values, but OAuth login will fail. You can still use email/password registration and login.

### Test Account
- Email: `user@example.com`
- Password: `user123`

## Database Changes

The User model has been updated to support OAuth:
- `password` field is now optional (nullable)
- `provider` field tracks the auth provider (email, google, facebook)
- `providerId` field stores the OAuth provider's user ID

## Security Notes

1. **Never commit `.env` files to version control**
2. Use strong, random `JWT_SECRET` in production
3. Always use HTTPS in production
4. Regularly rotate your OAuth client secrets
5. Monitor OAuth usage in your provider dashboards
