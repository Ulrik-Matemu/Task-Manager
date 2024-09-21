import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './TeamList.css'; // We'll create this CSS file next

const TeamList = () => {
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchTeams();
    }, []);

    const fetchTeams = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('https://task-manager-b2w1.onrender.com/teams', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTeams(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching teams', error);
            setError('Error fetching teams. Please try again.');
            setLoading(false);
        }
    };

    if (loading) return <div className="loading">Loading teams...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="team-list-container">
            <h2>Your Teams</h2>
            <Link to="/create-team" className="create-team-link">Create New Team</Link>
            <div className="team-grid">
                {teams.map(team => (
                    <div key={team._id} className="team-card">
                        <h3>{team.name}</h3>
                        <p>{team.description}</p>
                        <Link to={`/teams/${team._id}`} className="view-team-link">View Team</Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TeamList;