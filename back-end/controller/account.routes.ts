/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     AccountInput:
 *       type: object
 *       properties:
 *         isShared:
 *           type: boolean
 *         type:
 *           type: string
 *     Account:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *           format: int64
 *         accountNumber:
 *           type: string
 *         balance:
 *           type: number
 *         isShared:
 *           type: boolean
 *         startDate:
 *           type: string
 *           format: date-time
 *         endDate:
 *           type: string
 *           format: date-time
 *           nullable: true
 *         status:
 *           type: string
 *         type:
 *           type: string
 */
import express, { NextFunction, Request, Response } from 'express';
import accountService from '../service/account.service';
import { AccountInput } from '../types/index';

const accountRouter = express.Router();

/**
 * @swagger
 * /account:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     summary: Create a new account
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AccountInput'
 *     responses:
 *       200:
 *         description: The account was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Account'
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
accountRouter.post('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const account = <AccountInput>req.body;
        const result = await accountService.createAccount(account);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /account/{id}:
 *   get:
 *     summary: Get account by id.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *           format: int64
 *           required: true
 *     responses:
 *       200:
 *         description: JSON consisting of an account object
 *         content:
 *           application/json:
 *             schema:
 *                 $ref: '#/components/schemas/Account'
 */
accountRouter.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = Number(req.params.id);
        const account = await accountService.getAccountById({ id });
        res.status(200).json(account);
    } catch (error: any) {
        next(error);
    }
});

/**
 * @swagger
 * /account/accountNumber/{accountNumber}:
 *   get:
 *     summary: Get account by account number.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: accountNumber
 *         schema:
 *           type: string
 *           required: true
 *     responses:
 *       200:
 *         description: JSON consisting of an account object
 *         content:
 *           application/json:
 *             schema:
 *                 $ref: '#/components/schemas/Account'
 */
accountRouter.get(
    '/accountNumber/:accountNumber',
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const accountNumber = req.params.accountNumber;
            const account = await accountService.getAccountByAccountNumber(accountNumber);
            res.status(200).json(account);
        } catch (error: any) {
            next(error);
        }
    }
);

/**
 * @swagger
 * /account:
 *   get:
 *     summary: Get accounts associated with the authenticated user.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: JSON array consisting of account objects.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Account'
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: No accounts found for the user.
 *       500:
 *         description: Internal server error.
 */ accountRouter.get(
    '/',
    async (req: Request & { auth: any }, res: Response, next: NextFunction) => {
        try {
            const request = req as Request & { auth: { email: string } };
            const { email } = request.auth;
            const accounts = await accountService.getAccountsOfUser(email);
            res.status(200).json(accounts);
        } catch (error: any) {
            next(error);
        }
    }
);

/**
 * @swagger
 * /account:
 *   put:
 *     summary: Update account by ID (primarily used to update status)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AccountInput'
 *     responses:
 *       200:
 *         description: The updated account object.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Account'
 *       400:
 *         description: Invalid input.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Account not found.
 *       500:
 *         description: Internal server error.
 */
accountRouter.put('/', async (req: Request & { auth: any }, res: Response, next: NextFunction) => {
    try {
        const request = req as Request & { auth: { email: string } };
        const { email } = request.auth;
        const accountInput = <AccountInput>req.body;
        const updatedAccount = await accountService.updateAccount(email, accountInput);
        res.status(200).json(updatedAccount);
    } catch (error: any) {
        next(error);
    }
});

/**
 * @swagger
 * /account/{accountNumber}:
 *   delete:
 *     summary: Delete account by account number.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: accountNumber
 *         schema:
 *           type: string
 *           required: true
 *     responses:
 *       200:
 *         description: Account deleted successfully.
 *       400:
 *         description: Bad request.
 */
accountRouter.delete('/:accountNumber', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const accountNumber = req.params.accountNumber;
        await accountService.deleteAccount(accountNumber);
        res.status(200).json({ message: 'Account deleted successfully' });
    } catch (error: any) {
        next(error);
    }
});

export { accountRouter };
