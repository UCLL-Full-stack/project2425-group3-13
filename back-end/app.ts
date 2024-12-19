import * as dotenv from 'dotenv';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import * as bodyParser from 'body-parser';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { userRouter } from './controller/user.routes';
import { accountRouter } from './controller/account.routes';
import { transactionRouter } from './controller/transaction.routes';
import { expressjwt } from 'express-jwt';

const app = express();
dotenv.config();
const port = process.env.APP_PORT || 3000;

app.use(cors({ origin: 'http://localhost:8080' }));
app.use(bodyParser.json());

app.use(
    expressjwt({
        secret: process.env.JWT_SECRET || 'default_secret',
        algorithms: ['HS256'],
    }).unless({
        path: ['/api-docs', /^\/api-docs\/.*/, '/users/login', '/users/signup', '/status'],
    })
);

app.use('/users', userRouter);
app.use('/account', accountRouter);
app.use('/transaction', transactionRouter);

app.get('/status', (req, res) => {
    res.json({ message: 'Back-end is running...' });
});

const swaggerOpts = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Bank API',
            version: '1.0.0',
        },
    },
    apis: ['./controller/*.ts'],
};
const swaggerSpec = swaggerJSDoc(swaggerOpts);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Generic error handler
app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
    res.status(400).json({
        status: 'application error',
        message: error.message,
    });
});

// app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    // if (error.name === 'UnauthorizedError') {
    //     res.status(401).json({ status: 'unauthorized', message: error.message });
    // } else if (err.name === 'CoursesError') {
//         res.status(400).json({ status: 'domain error', message: err.message });
//     } else {
//         res.status(400).json({ status: 'application error', message: err.message });
//     }
// });

app.use((error: Error, req: Request, res: Response, next: NextFunction) => {    
    res.status(400).json({
        status: 'application error',
        message: error.message,
    });
}
);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
