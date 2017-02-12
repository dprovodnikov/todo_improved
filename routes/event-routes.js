import express from 'express';
import * as EventController from '../controllers/event-controllers';

const router = express.Router();

router.get('/', EventController.get)
router.post('/create', EventController.create);
router.post('/delete', EventController.remove);

export default router;