export interface Subscription {
    id: string;
    userId: string;
    creatorId: string;
    status: 'active' | 'cancelled' | 'expired';
    startDate: string;
    endDate?: string;
    price: number;
}
//# sourceMappingURL=subscription.types.d.ts.map