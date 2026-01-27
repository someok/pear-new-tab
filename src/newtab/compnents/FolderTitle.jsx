import { useMemo } from 'react';

import { Flex, Typography } from 'antd';

import { parseEmojiPrefix } from '@/utils/stringUtils';

function FolderTitle({ title, itemCount }) {
    const { emoji, string } = useMemo(() => {
        return parseEmojiPrefix(title);
    }, [title]);

    return (
        <Flex align="center">
            {emoji && <div className="pr-4 pl-2 text-center text-3xl">{emoji}</div>}
            <Flex vertical>
                <Typography.Text ellipsis strong className="text-lg">
                    {string}
                </Typography.Text>
                <Typography.Text type="secondary">
                    {itemCount}
                    {' '}
                    sites
                </Typography.Text>
            </Flex>
        </Flex>
    );
}

export default FolderTitle;
