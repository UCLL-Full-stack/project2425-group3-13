/**
 * @swagger
 * components:
 *    securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *    schemas:
 *      User:
 *        type: object
 *        properties:
 *          id:
 *            type: number
 *            format: int64
 *          nationalRegisterNumber:
 *            type: string
 *          name:
 *            type: string
 *          birthDate:
 *            type: string
 *            format: date
 *          isAdministrator:
 *            type: boolean
 *          phoneNumber:
 *            type: string
 *          email:
 *            type: string
 *          password:
 *            type: string
 *          accounts:
 *            type: array
 *            items:
 *              $ref: '#/components/schemas/Account'
 *      UserInput:
 *        type: object
 *        properties:
 *          nationalRegisterNumber:
 *            type: string
 *          name:
 *            type: string
 *          birthDate:
 *            type: string
 *            format: date
 *          isAdministrator:
 *            type: boolean
 *          phoneNumber:
 *            type: string
 *          email:
 *            type: string
 *          password:
 *            type: string
 */

import express, { NextFunction, Request, Response } from 'express';
import userService from '../service/user.service';
import { UserInput } from '../types/index';

const userRouter = express.Router();

/**
 * @swagger
 * /users:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Get a list of all users
 *     responses:
 *       200:
 *         description: A list of users.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                  $ref: '#/components/schemas/User'
 */
userRouter.get(
    '/',
    async (req: Request & { auth: UserInput }, res: Response, next: NextFunction) => {
        try {
            const users = await userService.getAllUsers();
            res.status(200).json(users);
        } catch (error) {
            next(error);
        }
    }
);

/**
 * @swagger
 * /users/signup:
 *   post:
 *     summary: Create a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserInput'
 *     responses:
 *       200:
 *         description: The user was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: The user could not be created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */
userRouter.post('/signup', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userInput = <UserInput>req.body;
        const user = await userService.createUser(userInput);
        res.status(200).json(user);
    } catch (error: any) {
        next(error);
    }
});

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Get a user by email and password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The user's email
 *               password:
 *                 type: string
 *                 description: The user's password
 *     responses:
 *       200:
 *         description: The user was successfully retrieved
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: The user could not be retrieved
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */
userRouter.post('/login', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userInput = <UserInput>req.body;
        const result = await userService.authenticate(userInput);
        res.status(200).json(result);
    } catch (error: any) {
        next(error);
    }
});

/**
 * @swagger
 * /users/{nationalRegisterNumber}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Get a user by national register number
 *     parameters:
 *       - in: path
 *         name: nationalRegisterNumber
 *         required: true
 *         description: The user's national register number
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The user was successfully retrieved
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: The user could not be retrieved
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */
userRouter.get(
    '/:nationalRegisterNumber',
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const nationalRegisterNumber = req.params.nationalRegisterNumber;
            const result = await userService.getUserByNationalRegisterNumber(
                nationalRegisterNumber
            );
            res.status(200).json(result);
        } catch (error: any) {
            next(error);
        }
    }
);

/**
 * @swagger
 * /users/{nationalRegisterNumber}/accounts:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     summary: Add an account to a user
 *     parameters:
 *       - in: path
 *         name: nationalRegisterNumber
 *         required: true
 *         schema:
 *           type: string
 *         description: The user's national register number
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               accountNumber:
 *                 type: string
 *                 description: The account number to add
 *     responses:
 *       200:
 *         description: The account was successfully added to the user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: The account could not be added
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */
userRouter.post(
    '/:nationalRegisterNumber/accounts',
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const nationalRegisterNumber = req.params.nationalRegisterNumber;
            const accountNumber = <string>req.body.accountNumber;
            const result = await userService.addAccount(nationalRegisterNumber, accountNumber);
            res.status(200).json(result);
        } catch (error: any) {
            next(error);
        }
    }
);

/**
 * @swagger
 * /users/{nationalRegisterNumber}/settings:
 *   put:
 *     security:
 *       - bearerAuth: []
 *     summary: Update user credentials
 *     parameters:
 *       - in: path
 *         name: nationalRegisterNumber
 *         required: true
 *         schema:
 *           type: string
 *         description: The user's national register number
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               settings:
 *                 type: object
 *                 description: The settings to update
 *     responses:
 *       200:
 *         description: The settings were successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       400:
 *         description: The settings could not be updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
userRouter.put(
    '/:nationalRegisterNumber/settings',
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const nationalRegisterNumber = req.params.nationalRegisterNumber;
            const newUser = req.body;
            const result = await userService.updateUser(nationalRegisterNumber, newUser);
            res.status(200).json(result);
        } catch (error: any) {
            next(error);
        }
    }
);

/**
 * @swagger
 * /users/{nationalRegisterNumber}/settings:
 *   put:
 *     security:
 *       - bearerAuth: []
 *     summary: Update user credentials
 *     parameters:
 *       - in: path
 *         name: nationalRegisterNumber
 *         required: true
 *         schema:
 *           type: string
 *         description: The user's national register number
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserInput'
 *     responses:
 *       200:
 *         description: The user credentials were successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: The user credentials could not be updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */
userRouter.put(
    '/:nationalRegisterNumber/settings',
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const nationalRegisterNumber = req.params.nationalRegisterNumber;
            const userInput: UserInput = req.body;
            const result = await userService.updateUser(nationalRegisterNumber, userInput);
            res.status(200).json(result);
        } catch (error: any) {
            next(error);
        }
    }
);

/**
 * @swagger
 * /users/{nationalRegisterNumber}/settings:
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     summary: Delete a user
 *     parameters:
 *       - in: path
 *         name: nationalRegisterNumber
 *         required: true
 *         schema:
 *           type: string
 *         description: The user's national register number
 *     responses:
 *       200:
 *         description: The user was successfully deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User deleted successfully.
 *       400:
 *         description: The user could not be deleted
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */
userRouter.delete(
    '/:nationalRegisterNumber/settings',
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const nationalRegisterNumber = req.params.nationalRegisterNumber;
            const result = await userService.deleteUser(nationalRegisterNumber);
            res.status(200).json(result);
        } catch (error: any) {
            next(error);
        }
    }
);

export { userRouter };
