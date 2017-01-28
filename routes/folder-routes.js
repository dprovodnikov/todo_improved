import express from 'express';
import * as FolderController from '../controllers/folder-controllers';
const router = express.Router();


router.get('/', FolderController.getAll);

router.post('/create', FolderController.create);

router.post('/delete', FolderController.remove);

router.post('/update', FolderController.update);

export default router;
