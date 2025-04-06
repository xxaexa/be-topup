import { Request, Response } from "express";
import {MidtransClient}  from "midtrans-node-client";
import { v4 as uuidv4 } from "uuid";
import Transaction from "../models/Transaction";
import { successResponse, errorResponse } from "../utils/response";

export const createTransaction = async (req: Request, res: Response) => {
  try {
    const newTransaction = new Transaction(req.body);
    const savedTransaction = await newTransaction.save();

    const snap = new MidtransClient.Snap({
      isProduction: false,
      serverKey: process.env.SERVER_KEY,
      clientKey: process.env.CLIENT_KEY,
    });

    const transaction = await snap.createTransaction({
      payment_type: "bank_transfer",
      bank_transfer: { bank: "bca" },
      transaction_details: {
        order_id: uuidv4(),
        gross_amount: req.body.variants.price || 0, 
      },
      item_details: [
        {
          id: uuidv4(),
          name: req.body.name || "Voucher",
          quantity: 1,
          price: req.body.variants.price || 40000,
        },
      ],
      customer_details: {
        first_name: "Topup",
        last_name: "Voucher",
        email: "xxaexa1@gmail.com", 
        phone: "08123456789",
        billing_address: {
          address: "ds yex",
          city: "city",
          postal_code: "12345",
        },
      },
    });

    return res.status(201).json(
      successResponse("success", {
        transactionId: savedTransaction._id,  
        midtransToken: transaction.token,
      })
    );
  } catch (error) {
    console.log(error)
    return res
      .status(500)
      .json(errorResponse("Failed to create voucher and initiate payment", error));

  }
};

// Get all transactions
export const getTransactions = async (req: Request, res: Response) => {
  try {
    const transactions = await Transaction.find();
    return res.json(successResponse("Transactions fetched", transactions));
  } catch (error) {
    return res.status(500).json(errorResponse("Failed to fetch transactions", error));
  }
};

// Get a single transaction by ID
export const getTransactionById = async (req: Request, res: Response) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    console.log(transaction)
    if (!transaction) {
      return res.status(404).json(errorResponse("Transaction not found"));
    }

    return res.json(successResponse("Transaction found", transaction));
  } catch (error) {
    return res.status(500).json(errorResponse("Failed to fetch transaction", error));
  }
};

// Update transaction status
export const updateTransactionStatus = async (req: Request, res: Response) => {
  try {
    const transaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );

    if (!transaction) {
      return res.status(404).json(errorResponse("Transaction not found"));
    }

    return res.json(successResponse("Transaction status updated", transaction));
  } catch (error) {
    return res.status(500).json(errorResponse("Failed to update status", error));
  }
};

// Delete a transaction
export const deleteTransaction = async (req: Request, res: Response) => {
  try {
    const transaction = await Transaction.findByIdAndDelete(req.params.id);

    if (!transaction) {
      return res.status(404).json(errorResponse("Transaction not found"));
    }

    return res.json(successResponse("Transaction deleted", transaction));
  } catch (error) {
    return res.status(500).json(errorResponse("Failed to delete transaction", error));
  }
};
