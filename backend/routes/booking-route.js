import express from "express";
import * as bookingController from "../controller/booking-controller.js";

const router = express.Router();

router.post("/booking", bookingController.booking);

export default router;