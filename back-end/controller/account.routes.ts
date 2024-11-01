/**
 * @swagger
 *   components:
 *    schemas:
 *      Account:
 *          type: object
 *          properties:
 *            id:
 *              type: number
 *              format: int64
 *            accountNumber:
 *              type: string
 *            balance:
 *              type: string
 *            isShared:
 *              type: boolean
 *            startDate:
 *              type: string
 *              format: date-time
 *            endDate:
 *              type: string
 *              format: date-time 
 *            status:
 *              type: string
 *            users:
 *              type: array
 *              properties:
 *                  id:
 *                      type: number
 *                      formati: int64
 *      AccountInput:
 *          type: object
 *          properties:
 *            accountNumber:
 *              type: string
 *            balance:
 *              type: string
 *            isShared:
 *              type: boolean
 *            startDate:
 *              type: string
 *              format: date-time
 *            endDate:
 *              type: string
 *              formate: date-time 
 *            status:
 *              type: string
 *            users:
 *              type: array
 *              items:
 *                  $ref: '#/components/schemas/User'
 */
import express, { NextFunction, Request, Response } from 'express';
import accountService from '../service/account.service';

const accountRouter = express.Router();

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

export default accountRouter;