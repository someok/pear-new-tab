interface BaseBookmarkItem {
    id: string;
    parentId: string;
    index: number;
    title: string;
    dateAdded?: number;
}

export type Bookmark = BaseBookmarkItem & {
    url?: string;
};

export type BookmarkFolder = BaseBookmarkItem & {
    // 存在则表示是文件夹
    dateGroupModified?: number;
    children?: BaseBookmarkItem[];
};
