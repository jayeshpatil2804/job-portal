import { Router } from 'express';
import { uploadFile, deleteFile, getFile, updateFile } from '../controllers/file.controller';
import { upload } from '../../../config/multer.config';
import { protect, restrictTo } from '../../auth/middleware/auth.middleware';

const router = Router();

router.post('/upload', protect, restrictTo('CANDIDATE', 'RECRUITER'), upload.single('resume'), uploadFile);
router.get('/:id', protect, restrictTo('CANDIDATE', 'RECRUITER'), getFile);
router.put('/:id', protect, restrictTo('CANDIDATE', 'RECRUITER'), upload.single('resume'), updateFile);
router.delete('/:id', protect, restrictTo('CANDIDATE', 'RECRUITER'), deleteFile);

export default router;
