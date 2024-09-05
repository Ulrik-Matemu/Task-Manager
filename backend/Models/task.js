const moongoose = require('mongoose');
const Joi = require('joi');
const { default: mongoose } = require('mongoose');

const taskSchema = new moongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    status: {
        type: String,
        enum: ['pending', 'in-progress', 'completed'],
        default: 'pending',
        required: true
    },
    dueDate: {
        type: Date,
        required: true
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium',
        required: true
    },
    user: {
        type: moongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    team: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Team'
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

function validateTask(task) {
    const schema = Joi.object({
        title: Joi.string().min(1).required(),
        description: Joi.string().min(5).required(),
        status: Joi.string().required(),
        dueDate: Joi.string().min(4).required(),
        priority: Joi.string().required()
    });

    return schema.validate(task);
}

const Task = moongoose.model('Task', taskSchema);


module.exports = { Task, validateTask };