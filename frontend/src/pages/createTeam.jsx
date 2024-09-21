import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './CreateTeam.css'; // We'll create this CSS file later

const CreateTeam = () => {
    const [teamName, setTeamName] = useState('');
    const [teamDescription, setTeamDescription] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post('https://task-manager-b2w1.onrender.com/teams',
                { name: teamName, description: teamDescription },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            // Redirect to the new team's page
            navigate(`/teams/${response.data._id}`);
        } catch (err) {
            console.error('Error creating team:', err);
            if (err.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                setError(`Server error: ${err.response.status} - ${err.response.data.message || err.response.data}`);
            } else if (err.request) {
                // The request was made but no response was received
                setError('No response received from server. Please try again.');
            } else {
                // Something happened in setting up the request that triggered an Error
                setError(`Error: ${err.message}`);
            }
        }
    };

    return (
        <div className="create-team-container">
            <h2>Create New Team</h2>
            {error && <p className="error-message">{error}</p>}
            <form onSubmit={handleSubmit} className="create-team-form">
                <div className="form-group">
                    <label htmlFor="teamName">Team Name:</label>
                    <input
                        type="text"
                        id="teamName"
                        value={teamName}
                        onChange={(e) => setTeamName(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="teamDescription">Team Description:</label>
                    <textarea
                        id="teamDescription"
                        value={teamDescription}
                        onChange={(e) => setTeamDescription(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="create-team-button">Create Team</button>
            </form>
        </div>
    );
};

export default CreateTeam;