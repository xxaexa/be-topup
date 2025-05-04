import { Request, Response } from "express";
import {MidtransClient}  from "midtrans-node-client";
import { v4 as uuidv4 } from "uuid";
import { Transaction } from "../models/Transaction";
import { successResponse, errorResponse } from "../utils/response";
import { generateInvoiceTemplate } from "../utils/generateInvoice";
import { sendToMail } from "../utils/sendToMail";
import { Summary } from "../models/Summary";

export const createTransaction = async (req: Request, res: Response) => {
  try {
    const newTransaction = new Transaction(req.body);
    const savedTransaction = await newTransaction.save();

    // Simpan ke Summary
    await Summary.create({
      type: "transaction",
      game_name: savedTransaction.voucher_name, // diasumsikan sama
      voucher_name: savedTransaction.voucher_name,
      variant_price: savedTransaction.variant.price,
    });

    const snap = new MidtransClient.Snap({
      isProduction: false,
      serverKey: process.env.SERVER_KEY!,
      clientKey: process.env.CLIENT_KEY!,
    });

    const transaction = await snap.createTransaction({
      payment_type: "bank_transfer",
      bank_transfer: { bank: "bca" },
      transaction_details: {
        order_id: uuidv4(),
        gross_amount: savedTransaction.variant.price || 0,
      },
      item_details: [
        {
          id: uuidv4(),
          name: savedTransaction.voucher_name || "Voucher",
          quantity: 1,
          price: savedTransaction.variant.price || 40000,
        },
      ],
      customer_details: {
        first_name: savedTransaction.buyer_name || "Topup",
        last_name: "Voucher",
        email: savedTransaction.buyer_email || "xxaexa1@gmail.com",
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
    console.log(error);
    return res.status(500).json(
      errorResponse("Failed to create transaction and initiate payment", error)
    );
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
    const { email, delivery_status } = req.body;
    const { id } = req.params;
    console.log(delivery_status)
    // Update delivery status
    const transaction = await  Transaction.findByIdAndUpdate(req.params.id, { delivery_status }, { new: true });



    if (!transaction) {
      return res.status(404).json(errorResponse("Transaction not found"));
    }

    // send email
    // if (transaction.buyer_email) {
    //   const html = generateInvoiceTemplate({
    //     recipientName: transaction.buyer_name,
    //     gameName: transaction.voucher_name,
    //     variation: transaction.variant.name,
    //     price: transaction.variant.price,
    //     transactionId: transaction.payment_status,
    //     paymentMethod: transaction.paymentMethod,
    //     date: new Date().toLocaleDateString('id-ID'),
    //   });

    //   await sendToMail(email, "Invoice Top-up", html);
    // }

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
