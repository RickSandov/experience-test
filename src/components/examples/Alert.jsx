import { useState } from 'react';
import {
    Alert,
    PAGE_VARIANT,
    // INLINE_VARIANT,
    Button,
    Typography,
    makeStyles
} from '@ellucian/react-design-system/core';
import { spacing200 } from '@ellucian/react-design-system/core/styles/tokens';


const useStyles = makeStyles({
    name: 'EdsAlertTypesPageExample'
})(() => ({
    button: {
        margin: spacing200,
    },
}));

/**
 * Alert Types at Page Level
 */
function AlertTypesPageExample() {
    const { classes } = useStyles();
    const [alertType, setAlertType] = useState('error');
    const [open, setOpen] = useState(false);
    const [text, setText] = useState('Default error message.');

    const handleClick = (state) => () => {
        setOpen(true);
        setAlertType(state.alertType);
        setText(state.text);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const customId = 'AlertTypesPageExample';
    const successText = 'Your schedule changes have been successfully recorded for this student';
    const errorText = 'There was an error saving the form data';
    const warningText = 'Please update your email address so your students can be notified when you approve their schedule requests. Since your student\'s current e-mail address is not on file, the system cannot send an approval confirmation e-mail to the student';
    const infoText = 'You\'re all caught up! There are no Workflow tasks in your Inbox to display at this time';

    return (
        <div id={`${customId}_Container`}>
            <Typography
                gutterBottom
                id={`${customId}_Description`}
            >
                Click on a button to see the corresponding <code>Alert</code> render at the page level.
            </Typography>
            <div id={`${customId}_ButtonGroup`}>
                <Button
                    className={classes.button}
                    id={`${customId}_ToggleSuccess`}
                    onClick={handleClick({
                        alertType: 'success',
                        text: successText
                    })}
                >
                    Success
                </Button>
                <Button
                    className={classes.button}
                    id={`${customId}_ToggleInfo`}
                    onClick={handleClick({
                        alertType: 'info',
                        text: infoText
                    })}
                >
                    Information
                </Button>
                <Button
                    className={classes.button}
                    id={`${customId}_ToggleWarning`}
                    onClick={handleClick({
                        alertType: 'warning',
                        text: warningText
                    })}
                >
                    Warning
                </Button>
                <Button
                    className={classes.button}
                    id={`${customId}_ToggleError`}
                    onClick={handleClick({
                        alertType: 'error',
                        text: errorText
                    })}
                >
                    Error
                </Button>
            </div>
            <Alert
                alertType={alertType}
                id={`${customId}_Alert`}
                onClose={handleClose}
                open={open}
                text={text}
                variant={PAGE_VARIANT}
            />
        </div>
    );
}

export default AlertTypesPageExample;