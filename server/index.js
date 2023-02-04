const express = require("express");
const app = express();

app.use(express.json());

const postRouter = require('./routes/Pomodoro');
app.use('/post', postRouter);

const PORT = process.env.PORT || 3001;

app.listen(PORT, console.log(`Server started on port ${PORT}`));