import express from "express";
import { getDashboardSummary } from "../controllers/summaryController";

const router = express.Router()

router.get("/", getDashboardSummary)

export default router;