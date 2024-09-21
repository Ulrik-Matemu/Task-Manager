import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './TeamDetails.css';

const TeamDetails = () => {
    const [team, setTeam] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [newMemberEmail, setNewMemberEmail] = useState('');
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        fetchTeamDetails();
    }, [id]);

    const fetchTeamDetails = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`https://task-manager-b2w1.onrender.com/teams/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTeam(response.data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching team details:', err);
            setError('Failed to fetch team details. Please try again.');
            setLoading(false);
        }
    };

    const handleAddMember = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.post(`https://task-manager-b2w1.onrender.com/teams/${id}/invite`,
                { email: newMemberEmail },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setNewMemberEmail('');
            fetchTeamDetails(); // Refresh team details
        } catch (err) {
            console.error('Error adding member:', err);
            setError('Failed to add member. Please try again.');
        }
    };

    const handleRemoveMember = async (memberId) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`https://task-manager-b2w1.onrender.com/teams/${id}/members/${memberId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchTeamDetails(); // Refresh team details
        } catch (err) {
            console.error('Error removing member:', err);
            setError('Failed to remove member. Please try again.');
        }
    };

    if (loading) return <div className="loading">Loading team details...</div>;
    if (error) return <div className="error">{error}</div>;
    if (!team) return <div className="error">Team not found</div>;

    return (
        <div className="team-details">
            <h2>{team.name}</h2>
            <p>{team.description}</p>

            <h3>Team Members</h3>
            <ul className="member-list">
                {team.members.map(member => (
                    <li key={member.user._id} className="member-item">
                        {member.user.name} ({member.role})
                        {team.owner._id !== member.user._id && (
                            <button onClick={() => handleRemoveMember(member.user._id)} className="remove-member-btn">
                                Remove
                            </button>
                        )}
                    </li>
                ))}
            </ul>

            <form onSubmit={handleAddMember} className="add-member-form">
                <input
                    type="email"
                    value={newMemberEmail}
                    onChange={(e) => setNewMemberEmail(e.target.value)}
                    placeholder="Enter member's email"
                    required
                />
                <button type="submit">Add Member</button>
            </form>

            <button onClick={() => navigate('/teams')} className="back-btn">Back to Teams</button>
        </div>
    );
};

export default TeamDetails;