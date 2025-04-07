import { app, env } from "./config/index.js";

// For local development
if (process.env.NODE_ENV !== "production") {
    const PORT = env.PORT || 4000;
    app.listen(PORT, () => console.log(`Server running at ${PORT}`));
}

// Export the Express app for Vercel
export default app;
