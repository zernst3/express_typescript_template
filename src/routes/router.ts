// types
import { Request, Response, NextFunction } from "express";

const express = require("express");

const router = express.Router();

router.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.json("Server is running");
});

router.use("/translate", require("./translate"));

module.exports = router;
