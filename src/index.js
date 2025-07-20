import express from 'express';
import contactsRouter from './routes/contacts.js';
import authRouter from './routes/auth.js';
import errorHandler from './middlewares/errorHandler.js'; // або як він у тебе називається

const app = express();

// Підключення middleware для парсингу JSON, кукі, cors, логування тощо
app.use(express.json());
// інші middlewares ...

// Підключення роутів
app.use('/contacts', contactsRouter);
app.use('/auth', authRouter);

// Помилка 404
app.use((req, res, next) => {
  res.status(404).json({ status: 'fail', code: 404, message: 'Not found', data: {} });
});

// Підключення errorHandler — ОСТАННІМ middleware
app.use(errorHandler);

export default app;