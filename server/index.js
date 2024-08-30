import express from "express";
import fs from "fs";
import cors from "cors";
import https from "https";
import { checkoutPayment } from "./controllers/paymentController.js";

const port = 8443;

const app = express();
const router = express.Router();

app.use(
  cors({
    origin: "https://localhost:5173",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", router);

router.post("/checkout", checkoutPayment);

const options = {
  key: fs.readFileSync("./private.key"),
  cert: fs.readFileSync("./certificate.crt"),
};

const server = https.createServer(options, app);

server.listen(port, () => {
  console.log(`Server running at https://localhost:${port}`);
});
