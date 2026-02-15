export interface User {
    sub: number; // JWT subject is user id
}

export interface Player {
    id: number;
    name: string;
    position: string;
    isForSale: boolean;
    askingPrice?: number;
}

export interface Team {
    id: number;
    name: string;
    budget: number;
    status: string;
}

export interface MyTeamResponse {
    team: Team;
    players: Player[];
}

export interface MarketPlayer {
    playerId: number;
    name: string;
    position: string;
    askingPrice: number;
    team: {
        id: number;
        name: string;
    };
}

export interface AuthResponse {
    token: string;
    isNewUser: boolean;
}
