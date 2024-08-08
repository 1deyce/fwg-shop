import express from "express";
import cors from "cors";

const port = 8000;

const app = express();

app.use(cors({
    origin: "http://localhost:5173"
}));

app.use("/", (req, res) => {
    res.send("hello there!")
});

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`)
})