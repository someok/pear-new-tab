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
                root: 'h-full w-full border border-red-500 flex items-center justify-center',
                image: 'border border-green-500 w-auto',
            }}
        />
    );
}

export default BookmarkIcon;
