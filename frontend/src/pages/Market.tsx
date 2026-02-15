import { useState, useEffect } from 'react';
import api from '../services/api';
import type { MarketPlayer } from '../types';

const Market = () => {
    const [players, setPlayers] = useState<MarketPlayer[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Filters
    const [playerName, setPlayerName] = useState('');
    const [teamName, setTeamName] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');

    const fetchMarket = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (playerName) params.append('playerName', playerName);
            if (teamName) params.append('teamName', teamName);
            if (minPrice) params.append('minPrice', minPrice);
            if (maxPrice) params.append('maxPrice', maxPrice);

            const response = await api.get<MarketPlayer[]>(`/transfers?${params.toString()}`);
            setPlayers(response.data);
            setError('');
        } catch (err: any) {
            setError('Failed to load market data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMarket();
    }, []); // Initial load

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        fetchMarket();
    };

    const handleBuy = async (player: MarketPlayer) => {
        if (!confirm(`Buy ${player.name} for $${player.askingPrice.toLocaleString()}?`)) return;

        try {
            await api.post('/transfers/buy', { playerId: player.playerId });
            alert('Player purchased successfully!');
            fetchMarket(); // Refresh list
        } catch (err: any) {
            alert(err.response?.data?.message || 'Failed to buy player');
        }
    };

    return (
        <div className="container" style={{ marginTop: '2rem' }}>
            <h2 style={{ marginBottom: '1.5rem' }}>Transfer Market</h2>

            <div className="card" style={{ marginBottom: '2rem' }}>
                <form onSubmit={handleSearch} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', alignItems: 'end' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Player Name</label>
                        <input type="text" className="input" value={playerName} onChange={(e) => setPlayerName(e.target.value)} placeholder="e.g. Ronaldo" />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Team Name</label>
                        <input type="text" className="input" value={teamName} onChange={(e) => setTeamName(e.target.value)} placeholder="e.g. Real Madrid" />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Min Price</label>
                        <input type="number" className="input" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} placeholder="0" />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Max Price</label>
                        <input type="number" className="input" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} placeholder="10000000" />
                    </div>
                    <button type="submit" className="btn btn-primary">Search</button>
                </form>
            </div>

            {loading && <div>Loading market...</div>}
            {error && <div style={{ color: 'var(--error)' }}>{error}</div>}

            {!loading && !error && (
                <div className="card" style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--border)' }}>
                                <th style={{ padding: '1rem' }}>Player</th>
                                <th style={{ padding: '1rem' }}>Position</th>
                                <th style={{ padding: '1rem' }}>Team</th>
                                <th style={{ padding: '1rem' }}>Price</th>
                                <th style={{ padding: '1rem' }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {players.length === 0 ? (
                                <tr>
                                    <td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                                        No players found on market.
                                    </td>
                                </tr>
                            ) : (
                                players.map((player) => (
                                    <tr key={player.playerId} style={{ borderBottom: '1px solid var(--border)' }}>
                                        <td style={{ padding: '1rem', fontWeight: '500' }}>{player.name}</td>
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
                                        <td style={{ padding: '1rem' }}>{player.team.name}</td>
                                        <td style={{ padding: '1rem', color: 'var(--success)', fontWeight: 'bold' }}>
                                            ${player.askingPrice.toLocaleString()}
                                        </td>
                                        <td style={{ padding: '1rem' }}>
                                            <button
                                                className="btn btn-primary"
                                                style={{ padding: '0.4rem 1rem', fontSize: '0.9rem' }}
                                                onClick={() => handleBuy(player)}
                                            >
                                                Buy
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default Market;
