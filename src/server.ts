import * as express from 'express';
import { apiRoute } from './routes/api';

const app: express.Application = express();
const port: number = 3000;

app.use(express.static('public'));
app.use('/api', apiRoute);

app.listen(port);


console.log('Server up and running. Listening on port ' + port);
