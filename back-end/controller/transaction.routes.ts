/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     Transaction:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           format: int64
 *         referenceNumber:
 *           type: string
 *         date:
 *           type: string
 *           format: date
 *         amount:
 *           type: number
 *         currency:
 *           type: string
 *         destinationAccountNumber:
 *           type: string
 *         sourceAccountNumber:
 *           type: string
 *         type:
 *           type: string
 *     TransactionInput:
 *       type: object
 *       properties:
 *         amount:
 *           type: number
 *           format: int32
 *         currency:
 *           type: string
 *         destinationAccountNumber:
 *           type: string
 */

import express, { NextFunction, Request, Response } from 'express';
import transactionService from '../service/transaction.service';
import { TransactionInput } from '../types';

const transactionRouter = express.Router();

/**
 * @swagger
 * /transaction/{accountNumber}:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     summary: Create a new expense
 *     parameters:
 *       - in: path
 *         name: accountNumber
 *         required: true
 *         schema:
 *           type: string
 *         description: The source account number
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TransactionInput'
 *     responses:
 *       200:
 *         description: The expense was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Transaction'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
transactionRouter.post(
    '/:accountNumber',
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { accountNumber } = req.params;
            const { destinationAccountNumber, ...expenseData } = req.body;
            const expense: TransactionInput = {
                ...expenseData,
                sourceAccountNumber: accountNumber,
                destinationAccountNumber,
            };
            const result = await transactionService.createExpense(expense);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }
);

/**
 * @swagger
 * /transaction/account/{id}:
 *   get:
 *     summary: Get transactions by account id.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           format: int64
 *         description: The account id
 *     responses:
 *       200:
 *         description: The transactions were successfully retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Transaction'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
transactionRouter.get('/account/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const result = await transactionService.getTransactionsAccountId(Number(id));
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /transaction/user/{id}:
 *   get:
 *     summary: Get transactions by user id.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           format: int64
 *         description: The user id
 *     responses:
 *       200:
 *         description: The transactions were successfully retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Transaction'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
transactionRouter.get('/user/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const result = await transactionService.getTransactionsByUserId(Number(id));
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /transaction/account/{id}/filter:
 *   post:
 *     summary: Get transactions by account id and filter option.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           format: int64
 *         description: The account id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               filterOption:
 *                 type: string
 *                 description: The filter option
 *               filterValue:
 *                 type: string
 *                 description: The filter value
 *     responses:
 *       200:
 *         description: The transactions were successfully retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Transaction'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
transactionRouter.post(
    '/account/:id/filter',
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const { filterOption, filterValue } = req.body;

            if (!filterOption || !filterValue) {
                return res.status(400).json({ message: 'Filter option and value are required' });
            }

            const transactions = await transactionService.filterAccountTransactions(
                Number(id),
                filterOption as string,
                filterValue as string
            );
            res.status(200).json(transactions);
        } catch (error) {
            next(error);
        }
    }
);

/**
 * @swagger
 * /transaction/user/{id}/filter:
 *   post:
 *     summary: Get transactions by user id and filter option.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           format: int64
 *         description: The user id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               filterOption:
 *                 type: string
 *                 description: The filter option
 *               filterValue:
 *                 type: string
 *                 description: The filter value
 *     responses:
 *       200:
 *         description: The transactions were successfully retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Transaction'
 */
transactionRouter.post(
    '/user/:id/filter',
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const { filterOption, filterValue } = req.body;

            if (!filterOption || !filterValue) {
                return res.status(400).json({ message: 'Filter option and value are required' });
            }

            const transactions = await transactionService.filterUserTransactions(
                Number(id),
                filterOption as string,
                filterValue as string
            );
            res.status(200).json(transactions);
        } catch (error) {
            next(error);
        }
    }
);

export { transactionRouter };
