import express from "express";
import https from "https";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;
const secret_key = process.env.SECRET_KEY;

if (secret_key === undefined) {
  console.error(
    "SECRET_KEY is not defined. Please set it in your environment variables."
  );
}

app.use(bodyParser.json());
app.use(
  cors({
    origin: "*",
    credentials: true,
    methods: ["GET", "POST"],
  })
);

app.post("/api/paystack/initialize", (req, res) => {
  const { email, amount } = req.body;

  const params = JSON.stringify({
    email: email,
    amount: amount,
  });

  const options = {
    hostname: "api.paystack.co",
    port: 443,
    path: "/transaction/initialize",
    method: "POST",
    headers: {
      Authorization: `Bearer ${secret_key}`,
      "Content-Type": "application/json",
    },
  };

  const apiReq = https.request(options, (apiRes) => {
    let data = "";

    apiRes.on("data", (chunk) => {
      data += chunk;
    });

    apiRes.on("end", () => {
      const responseData = JSON.parse(data);
      console.log("Paystack response:", responseData);
      res.json(responseData);
    });
  });

  apiReq.on("error", (error) => {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while connecting to Paystack." });
  });

  apiReq.write(params);
  apiReq.end();
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
