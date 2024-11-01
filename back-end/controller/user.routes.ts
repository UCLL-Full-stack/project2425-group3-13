/**
 * @swagger
 *   components:
 *    schemas:
 *      User:
 *          type: object
 *          properties:
 *            id:
 *              type: number
 *              format: int64
 *            nationalRegisterNumber:
 *              type: string
 *            name:
 *              type: string
 *            isAdministrator:
 *              type: boolean
 *            phoneNumber:
 *              type: string
 *            email:
 *              type: string
 *            password:
 *              type: string
 *            accounts:
 *              type: array
 *              items:
 *                  $ref: '#/components/schemas/Account'
 *      UserInput:
 *          type: object
 *          properties:
 *            nationalRegisterNumber:
 *              type: string
 *            name:
 *              type: string
 *            isAdministrator:
 *              type: boolean
 *            phoneNumber:
 *              type: string
 *            email:
 *              type: string
 *            password:
 *              type: string
 */
import express, { NextFunction, Request, Response } from 'express';
import userService from '../service/user.service';
import { UserInput } from '../types';

const userRouter = express.Router();

/**
 * @swagger
 * /user:
 *   post:
 *     summary: Create new user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nationalRegisterNumber:
 *                 type: string
 *                 description: The nationalregisternumber of the user.
 *               name:
 *                 type: string
 *                 description: The actual name of the user.
 *               isAdministrator:
 *                 type: boolean
 *                 description: Is the user administrator or not.
 *               phoneNumber:
 *                 type: string
 *                 description: The phonenumber of the user.
 *               email:
 *                 type: string
 *                 description: The email of the user.
 *               password:
 *                 type: string
 *                 description: The password of the user.
 *     responses:
 *       200:
 *         description: JSON consisting of the newly created user object.
 *         content:
 *           application/json:
 *             schema:
 *                 $ref: '#/components/schemas/User'
 */
userRouter.post('/', (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = <UserInput>req.body; 
        const result = userService.createUser(user);
        res.status(200).json(result);
    } catch (error:any) {
        next(error);
    }
});

export default userRouter;