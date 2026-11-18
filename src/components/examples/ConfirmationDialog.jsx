import { useCallback, useState } from 'react';
import {
    ConfirmationDialog,
    Button
} from '@ellucian/react-design-system/core';

/**
 * Basic ConfirmationDialog
 */
const ConfirmationDialogExample = () => {
    const [open, setOpen] = useState(false);
    const customId = 'ConfirmationDialogExample';

    const handleClickOpen = useCallback(() => {
        setOpen(true);
    }, []);

    const handleClose = useCallback(() => {
        setOpen(false);
    }, []);

    const DialogProps = {
        id: `${customId}_Dialog`,
        'aria-labelledby': `${customId}_DialogTitle`
    };
    const DialogActionsProps = {
        id: `${customId}_DialogActions`
    };
    const DialogContentProps = {
        id: `${customId}_DialogContent`
    };
    const DialogContentTextProps = {
        id: `${customId}_DialogContentText`
    };
    const DialogTitleProps = {
        id: `${customId}_DialogTitle`
    };
    const primaryActionProps = {
        id: `${customId}_primaryAction`,
        autoFocus: true
    };
    const secondaryActionProps = {
        id: `${customId}_secondaryAction`
    };

    return (
        <div id={`${customId}_Container`}>
            <div id={`${customId}_Example`}>
                <Button
                    id={`${customId}_OpenDialog`}
                    onClick={handleClickOpen}
                >
                    Open ConfirmationDialog
                </Button>
                <ConfirmationDialog
                    contentText="Permanently deleting a user account will remove all data associated with this user. You will not be able to undo this action."
                    DialogProps={DialogProps}
                    DialogActionsProps={DialogActionsProps}
                    DialogContentProps={DialogContentProps}
                    DialogContentTextProps={DialogContentTextProps}
                    DialogTitleProps={DialogTitleProps}
                    open={open}
                    primaryActionOnClick={handleClose}
                    primaryActionProps={primaryActionProps}
                    primaryActionText="Delete"
                    secondaryActionOnClick={handleClose}
                    secondaryActionProps={secondaryActionProps}
                    secondaryActionText="Cancel"
                    title="Delete this user account?"
                    id="dialog_container"
                    PaperProps={{
                        id: 'dialog_paper'
                    }}
                />
            </div>
        </div>
    );
};

export default ConfirmationDialogExample;
