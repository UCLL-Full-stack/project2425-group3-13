/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     Budgetgoal:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *           format: int64
 *         goalName:
 *           type: string
 *         targetAmount:
 *           type: number
 *           format: double
 *         currentAmount:
 *           type: number
 *           format: double
 *         isActive:
 *           type: boolean
 */
import express, { Request, Response } from 'express';

const budgetgoalRouter = express.Router();

export { budgetgoalRouter };
