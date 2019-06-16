import * as React from 'react';

export default function useToolbar(defaultTitle?: string) {
    const [ title, setTitle ] = React.useState<string|undefined>(defaultTitle);
    React.useEffect(() => {
        if (title !== undefined) {
            document.title = title;
        }
    });

    return setTitle;
}