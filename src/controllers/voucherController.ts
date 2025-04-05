import { Request, Response } from "express";
import Voucher from "../models/Voucher";
import { successResponse, errorResponse } from "../utils/response";

// Get all vouchers
export const getVouchers = async (_req: Request, res: Response) => {
  try {
    const vouchers = await Voucher.find();
    res.status(200).json(successResponse("Fetched vouchers", vouchers));
  } catch (error) {
    res.status(500).json(errorResponse("Failed to fetch vouchers", error));
  }
};

// Get one voucher
export const getVoucherById = async (req: Request, res: Response) => {
  try {
    const voucher = await Voucher.findOne({ id: req.params.id });
    if (!voucher) return res.status(404).json(errorResponse("Voucher not found"));
    res.status(200).json(successResponse("Fetched voucher", voucher));
  } catch (error) {
    res.status(500).json(errorResponse("Failed to fetch voucher", error));
  }
};

// Create voucher
export const createVoucher = async (req: Request, res: Response) => {
  try {
    const newVoucher = new Voucher(req.body);
    const savedVoucher = await newVoucher.save();
    res.status(201).json(successResponse("Voucher created", savedVoucher));
  } catch (error) {
    res.status(500).json(errorResponse("Failed to create voucher", error));
  }
};

// Update voucher
export const updateVoucher = async (req: Request, res: Response) => {
  try {
    const updated = await Voucher.findOneAndUpdate({ id: req.params.id }, req.body, {
      new: true,
    });
    if (!updated) return res.status(404).json(errorResponse("Voucher not found"));
    res.status(200).json(successResponse("Voucher updated", updated));
  } catch (error) {
    res.status(500).json(errorResponse("Failed to update voucher", error));
  }
};

// Delete voucher
export const deleteVoucher = async (req: Request, res: Response) => {
  try {
    const deleted = await Voucher.findOneAndDelete({ id: req.params.id });
    if (!deleted) return res.status(404).json(errorResponse("Voucher not found"));
    res.status(200).json(successResponse("Voucher deleted", deleted));
  } catch (error) {
    res.status(500).json(errorResponse("Failed to delete voucher", error));
  }
};
