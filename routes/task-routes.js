import express from 'express';
import * as TaskController from '../controllers/task-controllers';
const router = express.Router();

router.get('/completed', TaskController.getCompleted);

router.get('/overdue', TaskController.getOverdue);

router.get('/current', TaskController.getCurrent);

router.post('/create', TaskController.create);

router.post('/delete', TaskController.remove);

router.post('/update', TaskController.update);

router.post('/complete', TaskController.complete);

export default router;