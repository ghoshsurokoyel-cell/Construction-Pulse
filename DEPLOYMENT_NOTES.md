# Deployment Notes - Firebase Configuration Update

## ⚠️ SECURITY WARNING

The `.env.local` file contains sensitive Firebase credentials and was previously tracked in the repository. While we've added it to `.gitignore`, the credentials may still exist in the git history.

### Recommended Actions:

1. **For Production Deployment:**
   - Use environment variables in your hosting platform (Vercel, Railway, etc.)
   - Never commit `.env.local` or `.env` files
   - Rotate Firebase credentials if they were exposed in public repository

2. **Remove from Git History (if needed):**
   ```bash
   git rm --cached .env.local
   git commit -m "Remove .env.local from tracking"
   ```

## Current Configuration

### Environment Files
- `.env.local` - Frontend environment variables (Next.js)
- `.env` - Backend environment variables (Express server)
- Both files should contain the same Firebase configuration

### Firebase Projects
- **Production:** construction-pulse-v2
- **Credentials:** See `.env.local` (DO NOT COMMIT THIS FILE)

## Quick Start

1. **Clone Repository**
   ```bash
   git clone <repository-url>
   cd construction-pulse
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment**
   - Copy `.env.example` to `.env.local`
   - Copy `.env.local` to `.env`
   - Update with your Firebase credentials

4. **Start Development Servers**
   
   Terminal 1 - Backend:
   ```bash
   npm run dev:backend
   ```
   
   Terminal 2 - Frontend:
   ```bash
   npm run dev
   ```

5. **Access Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - Login Page: http://localhost:3000/login

## Verification

### Backend Health Check
```bash
curl http://localhost:5000/api/
```
Should return HTML (not JSON API root yet)

### Frontend Health Check
- Navigate to http://localhost:3000/login
- Open browser console (F12)
- Look for `[Firebase]` log messages
- Should see "✓ Firebase initialization complete"

## Known Issues

1. **Turbopack Custom Loader Disabled**
   - The visual-edits custom loader has been temporarily disabled
   - This fixes a Turbopack directory reading bug
   - May need re-enabling for Orchids integration

2. **Next.js Warnings**
   - eslint configuration warnings are expected
   - These are safe to ignore in development

## Production Checklist

- [ ] Rotate Firebase credentials
- [ ] Set up environment variables in hosting platform
- [ ] Remove .env.local from git tracking
- [ ] Enable Turbopack custom loader (if needed)
- [ ] Configure CORS for production domains
- [ ] Set up MongoDB Atlas IP whitelist
- [ ] Enable Firebase Authentication
- [ ] Test authentication flow
- [ ] Verify API endpoints
- [ ] Test file uploads

## Support

For Firebase issues, check the browser console for detailed logs.
Each Firebase initialization step is logged with `[Firebase]` prefix.

