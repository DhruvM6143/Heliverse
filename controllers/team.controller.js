import Team from "../models/team.model.js";
import asyncHandler from "../middleware/asyncHandler.js";
import User from "../models/user.model.js";

export const createTeam = asyncHandler(async (req, res) => {
    try {
        const { name, ids } = req.body;

        const members = await User.find({ _id: { $in: ids } })

        const uniqueDomains = new Set();
        for (const member of members) {
            if (!member.available) {
                return res.json({
                    success: false,
                    message: `user ${member.name} is not available`
                })
            }
            if (uniqueDomains.has(member.domain)) {
                return res.json({
                    success: false,
                    message: `user ${member.name} has already taken in the team`
                })
            }
            uniqueDomains.add(member.domain);
        }

        const team = new Team({ name, members: ids });
        await team.save();

        res.json({
            success: true,
            message: "Team created successfully",
            team,
            _id: team._id
        })

    } catch (error) {

        return res.json({
            success: false,
            message: error.message || error
        })

    }
});

export const getTeamById = asyncHandler(async (req, res) => {
    try {
        const newteam = await Team.findById(req.params.id).populate('members');
        if (!newteam) return res.json({
            success: false,
            message: 'Team not found'
        })
        res.json({
            success: true,
            newteam,
            _id: newteam._id
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || error
        })
    }
})
