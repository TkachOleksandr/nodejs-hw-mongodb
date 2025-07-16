import express from 'express';
import { resetPassword } from '../controllers/auth.js';
import { resetPasswordSchema } from '../validators/authSchemas.js';
import { validateBody } from '../middlewares/validateBody.js';
import {
  registerUser,
  loginUser,
  refreshSession,
  logoutUser,
  sendResetEmail,
} from '../controllers/auth.js';
import {
  registerSchema,
  loginSchema,
  emailOnlySchema,
} from '../validators/authSchemas.js';

const router = express.Router();

router.post('/reset-pwd', validateBody(resetPasswordSchema), resetPassword);
router.post('/register', validateBody(registerSchema), registerUser);
router.post('/login', validateBody(loginSchema), loginUser);
router.post('/refresh', refreshSession);
router.post('/logout', logoutUser);
router.post('/send-reset-email', validateBody(emailOnlySchema), sendResetEmail);

export default router;
