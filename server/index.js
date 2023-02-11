const express = require("express");
const app = express();
const cors = require("cors");

app.use(express.json());
app.use(cors());

const postRouter = require('./routes/Pomodoro');
app.use('/post', postRouter);

const loginRoute = require('./routes/User');
app.use('/login', loginRoute);

const PORT = process.env.PORT || 3001;

app.listen(PORT, console.log(`Server started on port ${PORT}`));