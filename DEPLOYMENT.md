# ChatEasy Deployment Guide

This guide will help you deploy the ChatEasy application with the backend on Render and the frontend on Vercel.

## Prerequisites

- GitHub account
- Render account (https://render.com)
- Vercel account (https://vercel.com)
- MongoDB Atlas account (for database)
- Cloudinary account (for image uploads)

## Part 1: Backend Deployment on Render

### Step 1: Prepare Your Backend

1. Make sure your code is pushed to GitHub
2. **IMPORTANT:** Ensure `.env` file is in `.gitignore` (already done ✓)
3. Your backend is already configured with MongoDB and Cloudinary credentials

### Step 2: Deploy on Render

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New +" → "Blueprint"
3. Connect your GitHub repository
4. Render will detect the `render.yaml` file automatically with pre-configured environment variables
5. **Only update this one variable:**
   - `CLIENT_URL`: Will be updated after deploying frontend (e.g., `https://your-app.vercel.app`)
   
   All other variables are already configured in render.yaml:
   - ✓ MONGODB_URI (already set)
   - ✓ JWT_SECRET (already set)
   - ✓ CLOUDINARY_CLOUDNAME (already set)
   - ✓ CLOUDINARY_API_KEY (already set)
   - ✓ CLOUDINARY_SECRET_KEY (already set)

6. Click "Apply" to start the deployment
7. Wait for the deployment to complete (5-10 minutes)
8. Note your backend URL (e.g., `https://chateasy-backend.onrender.com`)

**Important:** The first request may take 50+ seconds on the free tier as Render spins up the service.

## Part 2: Frontend Deployment on Vercel

### Step 1: Create Environment File

1. In the `frontend` folder, create a `.env` file:
   ```
   VITE_API_URL=https://your-backend-url.onrender.com/api
   ```
   Replace with your actual Render backend URL from Part 1.

### Step 2: Deploy on Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Configure the project:
   - **Framework Preset:** Vite
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`

5. Add Environment Variables:
   - Key: `VITE_API_URL`
   - Value: `https://your-backend-url.onrender.com/api` (your Render URL)

6. Click "Deploy"
7. Wait for deployment to complete
8. Note your frontend URL (e.g., `https://your-app.vercel.app`)

### Step 3: Update Backend CLIENT_URL

1. Go back to Render Dashboard
2. Navigate to your backend service
3. Go to "Environment" tab
4. Update the `CLIENT_URL` variable with your Vercel URL:
   ```
   CLIENT_URL=https://your-app.vercel.app
   ```
5. Save changes (this will trigger a redeployment)

## Part 3: Testing

1. Visit your Vercel URL
2. Try to sign up/login
3. Test sending messages
4. Test image uploads

## Troubleshooting

### CORS Issues
- Make sure `CLIENT_URL` in Render matches your Vercel URL exactly (no trailing slash)
- Check that `withCredentials: true` is set in axios configuration

### 503 Service Unavailable (Render)
- Free tier services spin down after inactivity
- First request may take 50+ seconds to wake up
- Consider upgrading to a paid plan for always-on service

### WebSocket Connection Failed
- Ensure your backend URL is using `https://` not `http://`
- Check that Socket.IO is properly configured for CORS

### Images Not Uploading
- Verify Cloudinary credentials are correct
- Check Cloudinary upload preset settings

## Environment Variables Summary

### Backend (Render)
```
NODE_ENV=production
PORT=10000
MONGODB_URI=mongodb+srv://jeevanvankadara_db_user:***@cluster0.bu3rzce.mongodb.net/?appName=Cluster0
JWT_SECRET=*** (already configured)
CLOUDINARY_CLOUDNAME=dpkpdcuvy
CLOUDINARY_API_KEY=516629111161128
CLOUDINARY_SECRET_KEY=*** (already configured)
CLIENT_URL=https://your-app.vercel.app (UPDATE THIS AFTER FRONTEND DEPLOYMENT)
```

Note: Most values are pre-configured in render.yaml. You only need to update CLIENT_URL after deploying frontend.

### Frontend (Vercel)
```
VITE_API_URL=https://your-backend.onrender.com/api
```

## Useful Commands

Generate JWT secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Additional Notes

- **Free Tier Limitations:**
  - Render: Service spins down after 15 minutes of inactivity
  - Vercel: 100GB bandwidth per month
  - MongoDB Atlas: 512MB storage

- **Production Best Practices:**
  - Use strong JWT secrets
  - Enable MongoDB IP whitelist
  - Set up proper error logging
  - Consider using a CDN for static assets
  - Monitor usage and performance

## Redeployment

### Backend
- Push changes to GitHub
- Render will automatically redeploy (if auto-deploy is enabled)

### Frontend
- Push changes to GitHub
- Vercel will automatically redeploy

## Support

If you encounter issues:
1. Check the logs in Render/Vercel dashboards
2. Verify all environment variables are set correctly
3. Ensure MongoDB and Cloudinary services are active
4. Check CORS configuration

---

**Happy Deploying! 🚀**
