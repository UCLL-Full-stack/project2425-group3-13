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
 *         users:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               nationalRegisterNumber:
 *                 type: string
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
 *         transactions:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Transaction'
 *         users:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/User'
 *         budgetgoals:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Budgetgoal'
 */
import express, { NextFunction, Request, Response } from 'express';
import accountService from '../service/account.service';
import userService from '../service/user.service';
import { AccountInput, UserInput } from '../types/index';

const accountRouter = express.Router();

/**
 * @swagger
 * /users/{email}/accounts:
 *   post:
 *     summary: Create a new account
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *         description: The user's email
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
 *         description: The account could not be created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Account'
 */
accountRouter.post('/users/:email/accounts', (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email } = req.params;
        const account = <AccountInput>req.body;

        const currentUser = userService.getUserByEmail(email);
        if (!currentUser) {
            throw new Error('User not found');
        }
        const result = accountService.createAccount(account, currentUser);
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
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *           format: int64
 *           required: true
 *           description: The lecturer id.
 *     responses:
 *       200:
 *         description: JSON consisting of an account object
 *         content:
 *           application/json:
 *             schema:
 *                 $ref: '#/components/schemas/Account'
 */
accountRouter.get('/:id', (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = Number(req.params.id);
        const account = accountService.getAccountById({ id });
        res.status(200).json(account);
    } catch(error: any) {
        next(error);
    }
});
export { accountRouter };
