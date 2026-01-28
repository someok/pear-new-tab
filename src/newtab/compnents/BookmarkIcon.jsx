import { useState } from 'react';

import { Image } from 'antd';

function BookmarkIcon({ src, fallback }) {
    const [error, setError] = useState(false);

    if (error) {
        return fallback;
    }
    return (
        <Image
            preview={false}
            src={src}
            onError={() => setError(true)}
            classNames={{
                root: 'h-full w-full flex items-center justify-center',
                image: 'w-6 h-6',
            }}
        />
    );
}

export default BookmarkIcon;
