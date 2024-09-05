const express = require("express");
const { Team } = require("../Models/team");
const { User } = require("../Models/user");
const authMiddleware = require("../Middleware/authMiddleware");
const router = express.Router();

router.use(authMiddleware);

//Create a new team
const createTeam = router.post("/teams", async (req, res) => {
  console.log("Received POST request to create team:", req.body);
  try {
    const team = new Team({
      name: req.body.name, // Changed from title to name
      description: req.body.description,
      owner: req.user._id,
      members: [{ user: req.user._id, role: "admin" }],
    });
    await team.save();

    // Add team to user's teams
    await User.findByIdAndUpdate(req.user._id, { $push: { teams: team._id } });

    res.status(201).send(team);
  } catch (error) {
    console.error("Error creating team:", error);
    res.status(400).send(error);
  }
});

// Get user's teams
const fetchUserTeams = router.get("/teams", async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("teams");
    res.send(user.teams);
  } catch (error) {
    res.status(500).send();
  }
});

// Get team details
const fetchTeamDetails = router.get("/teams/:id", async (req, res) => {
  try {
    const team = await Team.findById(req.params.id)
      .populate("members.user")
      .populate("owner");
    if (!team) {
      return res.status(404).send({ message: "Team not found" });
    }
    res.send(team);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Invite a user to a team
const InviteUser = router.post("/teams/:id/invite", async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);
    if (!team) {
      return res.status(404).send("Team not found");
    }

    // Check if the current user is the team owner or an admin
    const memberIndex = team.members.findIndex(
      (member) => member.user.toString() === req.user._id.toString()
    );
    if (
      memberIndex === -1 ||
      (team.owner.toString() !== req.user._id.toString() &&
        team.members[memberIndex].role !== "admin")
    ) {
      return res
        .status(403)
        .send({ error: "Only team owner or admin can invite new members" });
    }

    const invitedUser = await User.findOne({ email: req.body.email });
    if (!invitedUser) {
      return res.status(404).send({ error: "User not found" });
    }

    // Add user to team
    team.members.push({ user: invitedUser._id, role: "member" });
    await team.save();

    // Add team to user's teams
    await User.findByIdAndUpdate(invitedUser._id, {
      $push: { teams: team._id },
    });

    res.send(team);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Remove a member from a team
const deleteTeam = router.delete(
  "/teams/:id/members/:memberId",
  async (req, res) => {
    try {
      const team = await Team.findById(req.params.id);
      if (!team) {
        return res.status(404).send({ message: "Team not found" });
      }

      // Check if the current user is the team owner or an admin
      const currentMember = team.members.find(
        (member) => member.user.toString() === req.user._id.toString()
      );
      if (
        !currentMember ||
        (team.owner.toString() !== req.user._id.toString() &&
          currentMember.role !== "admin")
      ) {
        return res
          .status(403)
          .send({ error: "Only team owner or admin can remove members" });
      }

      // Remove the member
      team.members = team.members.filter(
        (member) => member.user.toString() !== req.params.memberId
      );
      await team.save();

      // Remove team from user's teams
      await User.findByIdAndUpdate(req.params.memberId, {
        $pull: { teams: team._id },
      });

      res.send(team);
    } catch (error) {
      res.status(400).send(error);
    }
  }
);

// ... Add more routes for updating team details, removing members, etc.

module.exports = {
  createTeam,
  fetchUserTeams,
  fetchTeamDetails,
  InviteUser,
  deleteTeam,
};
