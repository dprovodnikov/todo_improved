import express from 'express';
import * as EventController from '../controllers/event-controllers';

const router = express.Router();

router.get('/', EventController.get)
router.post('/create', EventController.create);
router.post('/delete', EventController.remove);
router.post('/update', EventController.update);

export default router;