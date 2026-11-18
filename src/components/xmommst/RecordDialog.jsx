import PropTypes from 'prop-types';
import { useForm, useStore } from '@tanstack/react-form';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Dropdown,
    DropdownItem,
    FormControl,
    FormControlLabel,
    Switch,
    TextField,
    makeStyles
} from '@ellucian/react-design-system/core';
import { spacing40 } from '@ellucian/react-design-system/core/styles/tokens';
import { useCodes, useRecordWrite } from '../../hooks';
import { OTHER_RELATIONSHIP } from '../../domain/records';
import {
    NAME_PATTERN, cleanName, codeOptions, emptyForm, formFromRecord, isValidName,
    onRelationshipChange, toCreateBody, toUpdateBody, validateRecordForm
} from '../../domain/recordForm';

/** F5: how long the invalid-name message stays up. */
const NAME_ERROR_MS = 10000;

const useStyles = makeStyles({ name: 'XmommstRecordDialog' })(() => ({
    fields: { display: 'flex', flexDirection: 'column', gap: spacing40, paddingTop: spacing40 }
}));

const fieldError = (field) => field.state.meta.errors[0];

/**
 * Create (no `record`) or edit an XMOMMST record. Rules F1–F9 from the spec: the
 * browser checks required/pattern/length on submit, then validateRecordForm checks
 * the same rules in code before anything is sent.
 */
const RecordDialog = ({ bannerId, record, onClose, notify }) => {
    const { classes } = useStyles();
    const isEdit = Boolean(record);
    const { rel, acc } = useCodes(true);
    const write = useRecordWrite(bannerId);
    const saving = write.isPending;

    const form = useForm({
        defaultValues: isEdit ? formFromRecord(record) : emptyForm(),
        validators: {
            onSubmit: ({ value }) => {
                const fields = validateRecordForm(value);
                return Object.keys(fields).length > 0 ? { fields } : undefined;
            }
        },
        onSubmit: async ({ value }) => {
            try {
                await write.mutateAsync(isEdit
                    ? { method: 'PUT', body: toUpdateBody(value, record) }
                    : { method: 'POST', body: toCreateBody(value, bannerId) });
                notify({ alertType: 'success', text: isEdit ? 'Record updated.' : 'Record added.' });
                onClose();
            } catch (error) {
                notify({ alertType: 'error', text: error.message || 'The record could not be saved.' });
            }
        }
    });

    const relCode = useStore(form.store, (state) => state.values.xmommstRelCode);

    const handleSave = (event) => {
        event.preventDefault();
        if (saving) return;
        // F5: trim, then re-check the browser pattern in code.
        const name = form.getFieldValue('xmommstName');
        form.setFieldValue('xmommstName', cleanName(name));
        if (cleanName(name) && !isValidName(name)) {
            notify({ alertType: 'error', text: 'The name has invalid characters.', autoHideDuration: NAME_ERROR_MS });
            return;
        }
        form.handleSubmit();
    };

    const relOptions = codeOptions(rel, 'zmomrelRelCode', 'zmomrelDesc', record?.xmommstRelCode);
    const accOptions = codeOptions(acc, 'zmomaccAccCode', 'zmomaccDesc', record?.xmommstAccCode);

    return (
        <Dialog
            open
            onClose={saving ? undefined : onClose}
            aria-labelledby="XmommstRecordDialog_Title"
            fullWidth
            maxWidth="sm"
        >
            <form onSubmit={handleSave}>
                <DialogTitle id="XmommstRecordDialog_Title">{isEdit ? 'Edit record' : 'Add record'}</DialogTitle>
                <DialogContent>
                    <div className={classes.fields}>
                        <form.Field name="xmommstRelCode">
                            {(field) => (
                                <FormControl fullWidth>
                                    <Dropdown
                                        id="XmommstRecordDialog_Relationship"
                                        label="Relationship to You"
                                        required
                                        value={field.state.value}
                                        onChange={(event) => {
                                            const next = onRelationshipChange(form.state.values, event.target.value);
                                            field.handleChange(next.xmommstRelCode);
                                            form.setFieldValue('xmommstMessage', next.xmommstMessage);
                                        }}
                                        error={Boolean(fieldError(field))}
                                        helperText={fieldError(field)}
                                    >
                                        {relOptions.map((option) => (
                                            <DropdownItem key={option.value} label={option.label} value={option.value} />
                                        ))}
                                    </Dropdown>
                                </FormControl>
                            )}
                        </form.Field>

                        {relCode === OTHER_RELATIONSHIP && (
                            <form.Field name="xmommstMessage">
                                {(field) => (
                                    <TextField
                                        id="XmommstRecordDialog_Description"
                                        label="Relationship description"
                                        required
                                        fullWidth
                                        value={field.state.value}
                                        onChange={(event) => field.handleChange(event.target.value)}
                                        error={Boolean(fieldError(field))}
                                        helperText={fieldError(field)}
                                    />
                                )}
                            </form.Field>
                        )}

                        <form.Field name="xmommstName">
                            {(field) => (
                                <TextField
                                    id="XmommstRecordDialog_Name"
                                    label="Parent/Guardian Name"
                                    required
                                    fullWidth
                                    value={field.state.value}
                                    onChange={(event) => field.handleChange(event.target.value)}
                                    inputProps={{ pattern: NAME_PATTERN, title: "Letters, apostrophes, hyphens, periods and spaces only" }}
                                    error={Boolean(fieldError(field))}
                                    helperText={fieldError(field)}
                                />
                            )}
                        </form.Field>

                        <form.Field name="xmommstPin">
                            {(field) => (
                                <TextField
                                    id="XmommstRecordDialog_Pin"
                                    label="PIN"
                                    required
                                    fullWidth
                                    value={field.state.value}
                                    onChange={(event) => field.handleChange(event.target.value)}
                                    inputProps={{ minLength: 4, maxLength: 4, pattern: '[0-9]*', inputMode: 'numeric', title: '4 digits' }}
                                    error={Boolean(fieldError(field))}
                                    helperText={fieldError(field)}
                                />
                            )}
                        </form.Field>

                        <form.Field name="xmommstAccCode">
                            {(field) => (
                                <FormControl fullWidth>
                                    <Dropdown
                                        id="XmommstRecordDialog_Access"
                                        label="Scope of Access"
                                        required
                                        value={field.state.value}
                                        onChange={(event) => field.handleChange(event.target.value)}
                                        error={Boolean(fieldError(field))}
                                        helperText={fieldError(field)}
                                    >
                                        {accOptions.map((option) => (
                                            <DropdownItem key={option.value} label={option.label} value={option.value} />
                                        ))}
                                    </Dropdown>
                                </FormControl>
                            )}
                        </form.Field>

                        {isEdit && (
                            <form.Field name="xmommstStatus">
                                {(field) => (
                                    <FormControlLabel
                                        label="Active"
                                        control={(
                                            <Switch
                                                id="XmommstRecordDialog_Status"
                                                checked={field.state.value === 'true'}
                                                onChange={(event) => field.handleChange(event.target.checked ? 'true' : 'false')}
                                            />
                                        )}
                                    />
                                )}
                            </form.Field>
                        )}
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button id="XmommstRecordDialog_Cancel" color="secondary" onClick={onClose} disabled={saving}>
                        Cancel
                    </Button>
                    <Button id="XmommstRecordDialog_Save" type="submit" disabled={saving}>
                        Save
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

RecordDialog.propTypes = {
    bannerId: PropTypes.string.isRequired,
    record: PropTypes.object,
    onClose: PropTypes.func.isRequired,
    notify: PropTypes.func.isRequired
};

export default RecordDialog;
