import { useState } from 'react';
import {
    TextField,
    Typography,
    useWidth,
    isWidthDown,
    makeStyles
} from '@ellucian/react-design-system/core';
import { spacing600 } from '@ellucian/react-design-system/core/styles/tokens';

const useStyles = makeStyles()(() => ({
    example: {
        marginBottom: spacing600,
    },
}));

/**
 * Responsive Full Width TextField
 */
const ResponsiveFullWidthExample = () => {
    const { classes } = useStyles();
    const [textFieldValue, setTextFieldValue] = useState('');
    const width = useWidth();

    const customId = 'TextFieldResponsiveFullWidth';

    return (
        <div id={`${customId}_Container`}>
            <div
                className={classes.example}
            >
                <TextField
                    id={`${customId}_Field`}
                    label="Full width TextField"
                    name="textFieldValue"
                    onChange={e => setTextFieldValue(e.target.value)}
                    value={textFieldValue}
                    fullWidth={isWidthDown('md', width)}
                />
            </div>
        </div>
    );
};
// hide-code-start
ResponsiveFullWidthExample.documentationElement = (
    <Typography paragraph>
        Use the <code>fullWidth</code> prop with the <code>useWidth</code> hook and <code>isWidthDown</code> function to define the responsive behavior
        of <code>TextField</code>.
    </Typography>
);
// hide-code-end

export default ResponsiveFullWidthExample;
