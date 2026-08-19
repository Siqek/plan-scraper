import express from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.get('/', (_, res) => {
    res.status(200).send('ok');
});

app.listen(PORT, () => {
    console.log('App is listening on port: ' + PORT);
});
