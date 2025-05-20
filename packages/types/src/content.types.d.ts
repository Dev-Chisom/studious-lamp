export interface Content {
    id: string;
    creatorId: string;
    title: string;
    description: string;
    type: 'post' | 'video' | 'image' | 'audio';
    url: string;
    thumbnailUrl?: string;
    isPublic: boolean;
    createdAt: string;
    updatedAt: string;
}
//# sourceMappingURL=content.types.d.ts.map