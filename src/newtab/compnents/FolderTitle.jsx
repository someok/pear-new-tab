import { useMemo } from 'react';

import { Flex, Typography } from 'antd';

import classNames from 'classnames';

import { parseEmojiPrefix } from '@/utils/stringUtils';

function FolderTitle({ title, itemCount }) {
    const { emoji, string } = useMemo(() => {
        return parseEmojiPrefix(title);
    }, [title]);

    return (
        <Flex align="center">
            {emoji && <div className="pr-4 pl-2 text-center text-3xl">{emoji}</div>}
            <Flex vertical>
                <Typography.Text ellipsis strong className="pl-1 text-lg">
                    {string}
                </Typography.Text>
                <div className={classNames(
                    'rounded-xs px-1 text-xs cursor-pointer',
                    'bg-gray-100 hover:bg-gray-300',
                    'dark:bg-gray-800 dark:hover:bg-gray-950',
                )}
                >
                    {itemCount}
                    {' '}
                    sites
                </div>
            </Flex>
        </Flex>
    );
}

export default FolderTitle;
