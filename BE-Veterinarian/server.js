import { app, env } from "./config/index.js";

const PORT = env.PORT || 4000;

app.listen(PORT, () => console.log(`server running at ${PORT}`));
