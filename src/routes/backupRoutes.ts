import express from 'express';
import { getBackup } from '../controllers/backupController.js';

const router = express.Router();

router.get('/download', getBackup);

export default router;
