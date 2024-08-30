import express from "express";
import cors from "cors";
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

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
