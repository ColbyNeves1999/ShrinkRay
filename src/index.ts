import './config';
import 'express-async-errors';
import express, { Express } from 'express';
import { registerUser, login } from './controllers/UserController';
import { shortenUrl, getOriginalUrl } from './controllers/LinkController';
import session from 'express-session';
import connectSqlite3 from 'connect-sqlite3';
import { getLinksByUserId } from './models/LinkModel';

const app: Express = express();
const { PORT, COOKIE_SECRET } = process.env;

const SQLiteStore = connectSqlite3(session);

app.use(session({
    store: new SQLiteStore({ db: 'sessions.sqlite', }),
    secret: COOKIE_SECRET,
    cookie: { maxAge: 8 * 60 * 60 * 1000 }, // 8 hours 
    name: 'session',
    resave: false,
    saveUninitialized: false,
  }));

app.use(express.json());

app.post('/api/users', registerUser);
app.post('/api/login', login);
app.post('/api/links', shortenUrl);
app.get('/:targetLinkId', getOriginalUrl);

console.log(await getLinksByUserId("73beb072-60f1-49ee-ab25-0ea1fb45c377"));

app.listen(PORT, () => {
    console.log(`Listening at http://localhost:${PORT}`);
  });