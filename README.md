
1. Install dependencies:
   `npm install`
2. Run the app:
2. Set [.env.local](.env.local)
3. Run the app:

   `npm run dev`

## Deployment to Render

1. Sign up for a Render account at [render.com](https://render.com).
2. Connect your GitHub repository to Render.
3. Create a new **Web Service** from your repository.
4. Configure the service:
   - **Runtime**: Node.js
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start`
   - **Environment Variables**:
     - `TMDB_API_KEY`: Your TMDB API key (get from [themoviedb.org](https://www.themoviedb.org/settings/api))
     - `APP_URL`: This will be automatically set by Render to your service URL
5. Deploy the service. Render will build and deploy your app automatically.
