import express from 'express';
import { getCompleted, getOverdue, getCurrent } from '../controllers/task-controllers';
const router = express.Router();

router.get('/completed', getCompleted);

router.get('/overdue', getOverdue);

router.get('/current', getCurrent);

export default router;