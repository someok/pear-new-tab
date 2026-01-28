import { useMemo } from 'react';

import { Flex, Tooltip, Typography } from 'antd';

import classNames from 'classnames';

import { openTabsInGroup } from '@/utils/chromeUtils';
import { parseEmojiPrefix } from '@/utils/stringUtils';

function FolderTitle({ title, urls }) {
    const { emoji, string } = useMemo(() => {
        return parseEmojiPrefix(title);
    }, [title]);

    const enableOpen = urls.length > 0;

    async function onOpenClick() {
        await openTabsInGroup(urls, string);
    }

    return (
        <Flex align="center" flex={1} className="overflow-hidden">
            {emoji && <div className="pr-4 pl-2 text-center text-3xl">{emoji}</div>}
            <Flex vertical flex={1} className="overflow-hidden">
                <Typography.Text ellipsis strong className="pl-1 text-lg">
                    {string}
                </Typography.Text>

                <Tooltip title={enableOpen ? '打开所有站点' : null}>
                    <div
                        className={classNames(
                            'rounded-xs px-1 text-xs w-fit',
                            'bg-gray-100 dark:bg-gray-800',
                            enableOpen && 'cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-950',
                            !enableOpen && 'cursor-not-allowed',
                        )}
                        onClick={onOpenClick}
                    >
                        {urls.length}
                        {' '}
                        sites
                    </div>
                </Tooltip>
            </Flex>
        </Flex>
    );
}

export default FolderTitle;
