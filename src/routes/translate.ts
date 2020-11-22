// types
import { Request, Response, NextFunction } from "express";

import Axios from "axios";

const router = require("express").Router();

const { v4: uuidv4 } = require("uuid");

let AZURESUBSCRIPTIONKEY = process.env.AZURESUBSCRIPTIONKEY || undefined;
let AZUREENDPOINT = process.env.AZUREENDPOINT || undefined;
let LOCATION = process.env.LOCATION || undefined;

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { sourceLanguage, messageText, targetLanguage } = req.body;

    if (!AZURESUBSCRIPTIONKEY || !AZUREENDPOINT || !LOCATION) {
      res.send(`translationUnavailable`);
    }

    const { data } = await Axios({
      baseURL: AZUREENDPOINT,
      url: "/translate",
      method: "post",
      headers: {
        "Ocp-Apim-Subscription-Key": AZURESUBSCRIPTIONKEY,
        "Ocp-Apim-Subscription-Region": LOCATION,
        "Content-type": "application/json",
        "X-ClientTraceId": uuidv4().toString(),
      },
      params: {
        "api-version": "3.0",
        from: sourceLanguage,
        to: targetLanguage,
      },
      data: [
        {
          text: messageText,
        },
      ],
      responseType: "json",
    });

    const translatedText: string = data[0]["translations"][0]["text"];
    res.send(translatedText);
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
