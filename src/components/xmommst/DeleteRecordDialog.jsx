import PropTypes from 'prop-types';
import { ConfirmationDialog } from '@ellucian/react-design-system/core';
import { useRecordWrite } from '../../hooks';
import { toDeleteBody } from '../../domain/recordForm';

/** Decision 13: confirm, then DELETE shu-delete-zmommst and report the result. */
const DeleteRecordDialog = ({ bannerId, record, onClose, notify }) => {
    const write = useRecordWrite(bannerId);
    const deleting = write.isPending;

    const handleDelete = async () => {
        if (deleting) return;
        try {
            await write.mutateAsync({ method: 'DELETE', body: toDeleteBody(record) });
            notify({ alertType: 'success', text: 'Record removed.' });
        } catch (error) {
            notify({ alertType: 'error', text: error.message || 'The record could not be removed.' });
        }
        onClose();
    };

    return (
        <ConfirmationDialog
            open
            title="Remove this record?"
            contentText={`Are you sure you want to remove ${record.xmommstName}? This action can't be undone.`}
            primaryActionText="Remove"
            primaryActionOnClick={handleDelete}
            primaryActionProps={{ id: 'XmommstDeleteDialog_Remove', disabled: deleting }}
            secondaryActionText="Cancel"
            secondaryActionOnClick={deleting ? undefined : onClose}
            secondaryActionProps={{ id: 'XmommstDeleteDialog_Cancel', disabled: deleting }}
            DialogProps={{ id: 'XmommstDeleteDialog', 'aria-labelledby': 'XmommstDeleteDialog_Title' }}
            DialogTitleProps={{ id: 'XmommstDeleteDialog_Title' }}
        />
    );
};

DeleteRecordDialog.propTypes = {
    bannerId: PropTypes.string.isRequired,
    record: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired,
    notify: PropTypes.func.isRequired
};

export default DeleteRecordDialog;
