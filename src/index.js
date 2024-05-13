import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { addStartTime } from './middlewares/calcTimes.js';
import authController from './controllers/authController.js';
import postController from './controllers/postController.js'
import { HttpStatusCode } from 'axios';
import { writeFileUsers } from './services/authService.js';
import { PORT } from './constants/index.js';


const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(addStartTime)

app.use('/auth', authController);
app.use('/posts', postController);


app.get('/write-file', async (req, res) => {
    try {
        await writeFileUsers();
        res.send(`Success to write users in File`);

    } catch (error) {
        res.status(HttpStatusCode.InternalServerError).send(`Write was failed by reason: ${JSON.stringify(error)}`);
    }
});




app.listen(PORT, () => console.log(`App runs on ${PORT}`));


