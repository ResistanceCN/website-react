export enum JoinStatus {
    PENDING = 'PENDING',
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED'
}

export interface JoinInfo {
    userId: string;
    agentName: string;
    telegram: string;
    regions: Array<string>;
    other: string;
    status: JoinStatus;
    comment: string;
    createdAt: Date;
    updatedAt: Date;
}
