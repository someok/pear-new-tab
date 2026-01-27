interface BaseBookmarkItem {
    id: string;
    parentId: string;
    index: number;
    title: string;
    dateAdded?: number;
}

export type BookmarkItem = BaseBookmarkItem & {
    url?: string;
};

export type BookmarkFolder = BaseBookmarkItem & {
    // 存在则表示是文件夹
    dateGroupModified?: number;
    children?: BaseBookmarkItem[];
};

export interface WorkspaceItem {
    id: string;
    title: string;
}
