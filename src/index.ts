import './config';
import 'express-async-errors';
import express, { Express } from 'express';
import { registerUser, login } from './controllers/UserController';
import { shortenUrl, getOriginalUrl } from './controllers/LinkController';
import session from 'express-session';
import connectSqlite3 from 'connect-sqlite3';

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

app.listen(PORT, () => {
    console.log(`Listening at http://localhost:${PORT}`);
  });