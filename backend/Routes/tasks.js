const express = require('express');
const { Task, validateTask } = require('../Models/task');
const authMiddleware = require('../Middleware/authMiddleware');
const router = express.Router();

router.use(authMiddleware);

const createTask = router.post('/tasks', async (req, res) => {
    const { error } = validateTask(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    try {
        const { title, description, status, dueDate, priority } = req.body;

        const task = new Task({
            title,
            description,
            status,
            dueDate,
            priority,
            user: req.user._id
        });

        await task.save();
        res.status(201).send(task);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

const fetchTasks = router.get('/tasks', async (req, res) => {
    try {
        const tasks = await Task.find({ user: req.user._id });
        if (!tasks.length) return res.status(404).send('No Tasks found');
        res.send(tasks);
    } catch (error) {
        res.status(500).send('Something went wrong');
    }
});

const fetchTask = router.get('/tasks/:id', async (req, res) => {
    try {
        const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
        if (!task) return res.status(400).send('Task not found');
        res.send(task);
    } catch (error) {
        res.status(500).send('Something went wrong 1');
    }
});

const updateTask = router.put('/tasks/:id', async (req, res) => {
    const { error } = validateTask(req.body);
    if (error) res.status(400).send(error.details[0].message);

    try {
        const { title, description, status, dueDate, priority } = req.body
        const task = await Task.findByIdAndUpdate({ _id: req.params.id, user: req.user._id }, {
            title,
            description,
            status,
            dueDate,
            priority
        }, { new: true, runValidators: true });
        if (!task) return res.status(404).send('Task not found');
        res.send(task);
    } catch (error) {
        res.status(500).send('Something went wrong 3');
    }
});

const deleteTask = router.delete('/tasks/:id', async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user._id });
        if (!task) return res.status(404).send('Task not found');
        res.status(204).send();
    } catch (error) {
        res.status(500).send('Something went wrong 4');
    }
});

const createTeamTask = router.post('/tasks', async (req, res) => {
    try {
        const { teamId, assignedTo, ...taskData } = req.body;

        let team;
        if (teamId) {
            team = await Team.findById(teamId);
            if (!team) {
                return res.status(404).send({ error: 'Team not found' });
            }
            // Check if user is a member of the team
            if (!team.members.some(member => member.user.toString() === req.user._id.toString())) {
                return res.status(403).send({ error: 'You are not a member of this team' });
            }
        }

        const task = new Task({
            ...taskData,
            user: req.user._id,
            team: teamId,
            assignedTo: assignedTo || req.user._id
        });

        await task.save();
        res.status(201).send(task);
    } catch (error) {
        res.status(400).send(error);
    }
});

module.exports = { createTask, fetchTask, fetchTasks, updateTask, deleteTask, createTeamTask };