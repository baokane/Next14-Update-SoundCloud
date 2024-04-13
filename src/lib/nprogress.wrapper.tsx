'use client';

import { AppProgressBar as ProgressBar } from 'next-nprogress-bar';

const NprogressWrapper = ({ children }: { children: React.ReactNode }) => {
    return (
        <>
            {children}
            <ProgressBar
                height="2px"
                color="#ccc"
                options={{ showSpinner: false }}
                shallowRouting
            />
        </>
    );
};

export default NprogressWrapper;