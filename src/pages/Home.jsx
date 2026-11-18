import { useEffect, useMemo, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import {
    Alert,
    Button,
    CircularProgress,
    INLINE_VARIANT,
    PAGE_VARIANT,
    TextField,
    Typography,
    makeStyles
} from '@ellucian/react-design-system/core';
import { spacing40, spacing50, widthInputFields } from '@ellucian/react-design-system/core/styles/tokens';
import { usePageControl } from '@ellucian/experience-extension-utils';
import { useCodes, useDebouncedValue, usePerson, useRecords, useXmommstAccess } from '../hooks';
import { isValidBannerId, normalizeBannerIdInput } from '../domain/bannerId';
import { isPersonFound, personHeading } from '../domain/person';
import { toRecordRow } from '../domain/records';
import RecordsTable from '../components/xmommst/RecordsTable';
import RecordDialog from '../components/xmommst/RecordDialog';
import DeleteRecordDialog from '../components/xmommst/DeleteRecordDialog';

const SEARCH_DELAY_MS = 500;
const NOTICE_MS = 6000;
const EMPTY_LIST_TEXT = 'This user has not yet granted any individuals FERPA authorization.';

const useStyles = makeStyles({ name: 'XmommstHome' })(() => ({
    page: { display: 'flex', flexDirection: 'column', gap: spacing50, margin: `0 ${spacing40}` },
    search: { maxWidth: widthInputFields },
    header: { display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: spacing40 }
}));

const bannerIdFromSearch = (search) => normalizeBannerIdInput(new URLSearchParams(search).get('bannerId'));

const HomePage = () => {
    const { classes } = useStyles();
    const { setPageTitle } = usePageControl();
    const { canRead, canWrite } = useXmommstAccess();
    const location = useLocation();
    const history = useHistory();

    const [input, setInput] = useState(() => bannerIdFromSearch(location.search));
    const debounced = useDebouncedValue(input, SEARCH_DELAY_MS);
    const bannerId = debounced === input && isValidBannerId(debounced) ? debounced : '';
    const active = canRead && Boolean(bannerId);

    useEffect(() => {
        setPageTitle('XMOMMST Admin');
    }, [setPageTitle]);

    // Keep ?bannerId= in step with the searched person, so a reload reopens it.
    useEffect(() => {
        if (debounced !== input) return;
        const search = isValidBannerId(debounced) ? `?bannerId=${debounced}` : '';
        if (search !== location.search) history.replace({ search });
    }, [debounced, input, history, location.search]);

    const person = usePerson(bannerId, active);
    const records = useRecords(bannerId, active);
    const { rel, acc } = useCodes(canRead);

    const rows = useMemo(
        () => (Array.isArray(records.data) ? records.data.map((record) => toRecordRow(record, { rel, acc })) : []),
        [records.data, rel, acc]
    );

    // editing: null (closed), {} (new record) or the record being edited.
    const [editing, setEditing] = useState(null);
    const [deleting, setDeleting] = useState(null);
    const [notice, setNotice] = useState(null);
    const notify = ({ alertType, text, autoHideDuration = NOTICE_MS }) =>
        setNotice({ alertType, text, autoHideDuration, key: Date.now() });

    if (!canRead) {
        return (
            <div className={classes.page}>
                <Alert
                    alertType="error"
                    id="XmommstHome_NoAccess"
                    open
                    text="You don't have access to XMOMMST records."
                    userDismissable={false}
                    variant={INLINE_VARIANT}
                />
            </div>
        );
    }

    const renderResult = () => {
        if (!active) return null;
        if (person.isLoading || records.isLoading) {
            return <CircularProgress aria-label="Loading records" />;
        }
        const error = person.error || records.error;
        if (error) {
            return <Alert alertType="error" id="XmommstHome_Error" open text={error.message} userDismissable={false} variant={INLINE_VARIANT} />;
        }
        if (!isPersonFound(person.data)) {
            return (
                <Alert
                    alertType="info"
                    id="XmommstHome_NotFound"
                    open
                    text={`No person found with Banner ID ${bannerId}.`}
                    userDismissable={false}
                    variant={INLINE_VARIANT}
                />
            );
        }
        return (
            <>
                <div className={classes.header}>
                    <Typography variant="h2" id="XmommstHome_Person">{personHeading(bannerId, person.data)}</Typography>
                    {canWrite && (
                        <Button id="XmommstHome_Add" onClick={() => setEditing({})}>Add record</Button>
                    )}
                </div>
                {rows.length === 0 ? (
                    <Typography id="XmommstHome_Empty">{EMPTY_LIST_TEXT}</Typography>
                ) : (
                    <RecordsTable rows={rows} canWrite={canWrite} onEdit={setEditing} onDelete={setDeleting} />
                )}
            </>
        );
    };

    return (
        <div className={classes.page}>
            <TextField
                className={classes.search}
                id="XmommstHome_BannerId"
                label="Banner ID"
                name="bannerId"
                value={input}
                onChange={(event) => setInput(normalizeBannerIdInput(event.target.value))}
                helperText="Enter an 8-digit Banner ID"
                inputProps={{ inputMode: 'numeric', maxLength: 8 }}
                fullWidth
            />
            {renderResult()}
            {editing && (
                <RecordDialog
                    key={editing.id ?? 'new'}
                    bannerId={bannerId}
                    record={editing.id ? editing : undefined}
                    onClose={() => setEditing(null)}
                    notify={notify}
                />
            )}
            {deleting && (
                <DeleteRecordDialog
                    bannerId={bannerId}
                    record={deleting}
                    onClose={() => setDeleting(null)}
                    notify={notify}
                />
            )}
            {notice && (
                <Alert
                    key={notice.key}
                    alertType={notice.alertType}
                    autoHideDuration={notice.autoHideDuration}
                    id="XmommstHome_Notice"
                    onClose={() => setNotice(null)}
                    open
                    text={notice.text}
                    variant={PAGE_VARIANT}
                />
            )}
        </div>
    );
};

export default HomePage;
