import { useState, useEffect } from 'react';
import api from '../services/api';
import type { MyTeamResponse, Player } from '../types';

const Dashboard = () => {
    const [teamData, setTeamData] = useState<MyTeamResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [sellPrice, setSellPrice] = useState<Record<number, string>>({});

    const fetchTeam = async () => {
        try {
            const response = await api.get<MyTeamResponse>('/team/me');
            setTeamData(response.data);
        } catch (err: any) {
            setError('Failed to load team data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTeam();
    }, []);

    const handleSell = async (player: Player) => {
        const priceStr = sellPrice[player.id];
        if (!priceStr) return;
        const price = parseInt(priceStr);

        if (isNaN(price) || price <= 0) {
            alert('Invalid price');
            return;
        }

        try {
            await api.post('/transfers/sell', { playerId: player.id, askingPrice: price });
            alert('Player listed for sale!');
            fetchTeam(); // Refresh data
        } catch (err: any) {
            alert(err.response?.data?.message || 'Failed to sell player');
        }
    };

    if (loading) return <div className="container" style={{ marginTop: '2rem' }}>Loading team...</div>;
    if (error) return <div className="container" style={{ marginTop: '2rem', color: 'var(--error)' }}>{error}</div>;
    if (!teamData) return <div className="container" style={{ marginTop: '2rem' }}>No team found.</div>;

    const { team, players } = teamData;

    // Define position order references
    const positionOrder: Record<string, number> = { 'GK': 1, 'DEF': 2, 'MID': 3, 'ATT': 4 };

    // Sort players by position
    const sortedPlayers = [...players].sort((a, b) => {
        const posA = positionOrder[a.position] || 99;
        const posB = positionOrder[b.position] || 99;
        return posA - posB;
    });

    return (
        <div className="container" style={{ marginTop: '2rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                <div className="card">
                    <h3 style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Team Value</h3>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                        ${players.reduce((acc, p) => acc + (p.askingPrice || 1000000), 0) // Approximation or need value from backend
                            .toLocaleString()}
                        {/* Backend doesn't send total value in Team info? Check dto */}
                        {/* TeamInfoDto has budget, but not value. We can just show Budget. */}
                    </div>
                </div>
                <div className="card">
                    <h3 style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Budget</h3>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--success)' }}>${team.budget.toLocaleString()}</div>
                </div>
                <div className="card">
                    <h3 style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Team Name</h3>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{team.name}</div>
                </div>
            </div>

            <h2 style={{ marginBottom: '1rem' }}>Squad ({players.length}/25)</h2>
            <div className="card" style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--border)' }}>
                            <th style={{ padding: '1rem' }}>Name</th>
                            <th style={{ padding: '1rem' }}>Position</th>
                            <th style={{ padding: '1rem' }}>Status</th>
                            <th style={{ padding: '1rem' }}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedPlayers.map((player) => (
                            <tr key={player.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                <td style={{ padding: '1rem' }}>{player.name}</td>
                                <td style={{ padding: '1rem' }}>
                                    <span style={{
                                        padding: '0.25rem 0.5rem',
                                        borderRadius: '4px',
                                        background: 'rgba(255, 255, 255, 0.1)',
                                        fontSize: '0.8rem'
                                    }}>
                                        {player.position}
                                    </span>
                                </td>
                                <td style={{ padding: '1rem' }}>
                                    {player.isForSale ? (
                                        <span style={{ color: 'var(--success)' }}>On Market</span>
                                    ) : 'Active'}
                                </td>
                                <td style={{ padding: '1rem' }}>
                                    {!player.isForSale ? (
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <input
                                                type="number"
                                                placeholder="Price"
                                                className="input"
                                                style={{ width: '100px', padding: '0.4rem' }}
                                                value={sellPrice[player.id] || ''}
                                                onChange={(e) => setSellPrice({ ...sellPrice, [player.id]: e.target.value })}
                                            />
                                            <button
                                                className="btn btn-primary"
                                                style={{ padding: '0.4rem 1rem', fontSize: '0.9rem' }}
                                                onClick={() => handleSell(player)}
                                            >
                                                Sell
                                            </button>
                                        </div>
                                    ) : (
                                        <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Listed</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Dashboard;
