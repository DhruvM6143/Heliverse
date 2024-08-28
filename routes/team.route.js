import { Router } from "express";
import { getTeamById, createTeam } from "../controllers/team.controller.js";

const router = Router();

router.route('/').post(createTeam);
router.route('/:id').get(getTeamById);

export default router;