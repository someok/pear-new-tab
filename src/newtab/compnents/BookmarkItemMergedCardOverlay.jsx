import { Badge, Flex, Typography } from 'antd';

/**
 * 合并卡片形式的拖拽覆盖层
 *
 * @param {object} props
 * @param {number} props.count - 选中的书签数量
 */
function BookmarkItemMergedCardOverlay({ count }) {
    return (
        <Badge count={count} offset={[-10, 10]}>
            <Flex
                align="center"
                justify="center"
                className="bg-accent relative h-16 w-64 shadow-lg"
                style={{ borderRadius: 8 }}
            >
                {/* 堆叠效果 - 底层卡片 */}
                {count > 2 && (
                    <div
                        className="bg-accent/30 border-accent absolute -top-2 right-0 bottom-0 left-2 h-full w-full rotate-4 rounded-lg"
                        style={{ zIndex: -2 }}
                    />
                )}
                <div
                    className="bg-accent/50 border-accent absolute -top-1 right-0 bottom-0 left-1 h-full w-full rotate-2 rounded-lg"
                    style={{ zIndex: -1 }}
                />
                <Typography.Text strong>
                    移动
                    {' '}
                    {count}
                    {' '}
                    个书签
                </Typography.Text>
            </Flex>
        </Badge>
    );
}

export default BookmarkItemMergedCardOverlay;
