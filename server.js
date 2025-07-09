import swaggerUi from 'swagger-ui-express';

import { SERVER } from "./src/config/constants.conf.js";
import { connectDB } from "./src/config/db.conf.js";
import logger from "./src/config/logger.conf.js";
import { responseError, routeError } from "./src/utils/errorHandler.util.js";
import authRouter from './src/routes/auth.route.js';
import userRouter from './src/routes/user.route.js';
import socialRouter from './src/routes/social.route.js';
import swaggerDoc from "./src/config/swagger.conf.js";
import { app } from "./app.js";

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));
app.use('/api/auth', authRouter);
app.use('/api/auth', socialRouter);
app.use('/api/auth/users', userRouter);

app.use(responseError);
app.use(routeError);
app.listen(SERVER.PORT, SERVER.HOST, async () => {
    await connectDB();
    logger.info(`Server running successfully on http://${SERVER.HOST}:${SERVER.PORT}`);
});