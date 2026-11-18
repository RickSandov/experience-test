import { useState } from 'react';
import {
    Backdrop,
    Button,
    CircularProgress,
    Typography
} from '@ellucian/react-design-system/core';

/**
 * Accessible Loading Screen
 */
const CircularProgressAccessible = () => {
    const [open, setOpen] = useState(false);


    return (
        <div>
            <Button onClick={() => setOpen(true)}>Show Backdrop</Button>
            <Backdrop open={open} onClick={() => setOpen(false)}>
                <Typography aria-live="assertive" variant="srOnly">
                    Validation in progress
                </Typography>
                <CircularProgress aria-label="Validation in progress" />
            </Backdrop>
        </div>
    );
};

// hide-code-start
CircularProgressAccessible.documentationElement = (
    <Typography paragraph>
        When using <code>CircularProgress</code> as a loading indicator, provide a message to the screen reader using an assertive <code>srOnly</code> <code>Typography</code> element.
    </Typography>
);
// hide-code-end

export { CircularProgressAccessible };
