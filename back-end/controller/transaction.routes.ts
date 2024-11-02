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
 *           type: number
 *           format: int64
 *         referenceNumber:
 *           type: string
 *         date:
 *           type: string
 *           format: date-time
 *         amount:
 *           type: number
 *           format: double
 *         currency:
 *           type: string
 *         type:
 *           type: string
 *         account:
 *           $ref: '#/components/schemas/Account'
 */
import express, { Request, Response } from 'express';

const transactionRouter = express.Router();

export { transactionRouter };
