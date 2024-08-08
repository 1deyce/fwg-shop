import express from "express";
import cors from "cors";
import checkoutPayment from "././controllers/paymentController";

const port = 8000;

const app = express();
const router = express.Router();

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.use("/", router);

router.post("/checkout", checkoutPayment);

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
