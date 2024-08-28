import { Router } from 'express'
import { deleteUserById, getAllUser, getUserById, register, updateUserById } from '../controllers/users.controller.js';

const router = Router()

router.route('/').post(register)
router.route('/:id').get(getUserById)
router.route('/:id').delete(deleteUserById)
router.route('/').get(getAllUser)
router.route('/:id').put(updateUserById)



export default router;