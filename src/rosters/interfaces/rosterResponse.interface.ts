export interface RosterResponse {
    id: number;
    name: string;
    firstName: string;
    lastName: string;
    imgUrl: string;
    blockedToPlay: boolean;
    blockedToPitch: boolean;
    isReinforcement: boolean;
}