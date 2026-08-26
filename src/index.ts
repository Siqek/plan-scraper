import express from "express";
import cors from "cors";

// controllers
import aggregateLessonsByTeacherAndSubject from "./controllers/schedule/aggregateLessonsByTeacherAndSubject/demo";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.get('/', (_, res) => {
    res.status(200).send('ok');
});

app.get('/demo/aggregate-lessons-by-teacher-and-subject', aggregateLessonsByTeacherAndSubject);

app.listen(PORT, () => {
    console.log('App is listening on port: ' + PORT);
});
