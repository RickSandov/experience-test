import PropTypes from 'prop-types';
import { AdvancedTable, IconButton, StatusLabel, Typography, makeStyles } from '@ellucian/react-design-system/core';
import { Edit as EditIcon, Trash as TrashIcon } from '@ellucian/ds-icons/lib';

const useStyles = makeStyles({ name: 'XmommstRecordsTable' })(() => ({
    scroll: { overflowX: 'auto' },
    actions: { display: 'flex', whiteSpace: 'nowrap' }
}));

const RelationshipCell = ({ row }) => (
    <div>
        <Typography>{row.original.relationship}</Typography>
        {row.original.relationshipDescription && (
            <Typography variant="body3">{row.original.relationshipDescription}</Typography>
        )}
    </div>
);

const StatusCell = ({ row }) => (
    <StatusLabel text={row.original.status} type={row.original.status === 'Active' ? 'success' : 'draft'} />
);

const baseColumns = [
    { accessorKey: 'name', header: 'Parent/Guardian Name' },
    { accessorKey: 'relationship', header: 'Relationship to You', Cell: RelationshipCell },
    { accessorKey: 'access', header: 'Scope of Access' },
    { accessorKey: 'pin', header: 'PIN' },
    { accessorKey: 'status', header: 'Status', Cell: StatusCell },
    { accessorKey: 'created', header: 'Created' },
    { accessorKey: 'lastActivity', header: 'Last activity' },
    { accessorKey: 'inactive', header: 'Inactive since' },
    { accessorKey: 'lastUpdatedBy', header: 'Last updated by' }
];

/**
 * XMOMMST records of one person. Edit and delete actions only when `canWrite`.
 * Rows come from `toRecordRow` (src/domain/records.js).
 */
const RecordsTable = ({ rows, canWrite, onEdit, onDelete }) => {
    const { classes } = useStyles();

    const ActionsCell = ({ row }) => (
        <div className={classes.actions}>
            <IconButton
                aria-label={`Edit the record for ${row.original.name}`}
                color="gray"
                onClick={() => onEdit(row.original.record)}
            >
                <EditIcon />
            </IconButton>
            <IconButton
                aria-label={`Remove the record for ${row.original.name}`}
                color="gray"
                onClick={() => onDelete(row.original.record)}
            >
                <TrashIcon />
            </IconButton>
        </div>
    );

    const columns = canWrite
        ? [...baseColumns, { id: 'actions', header: 'Actions', Cell: ActionsCell, enableSorting: false }]
        : baseColumns;

    return (
        <div className={classes.scroll}>
            <AdvancedTable
                id="XmommstRecordsTable"
                columns={columns}
                data={rows}
                getRowId={(row) => row.id}
            />
        </div>
    );
};

RecordsTable.propTypes = {
    rows: PropTypes.arrayOf(PropTypes.object).isRequired,
    canWrite: PropTypes.bool.isRequired,
    onEdit: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired
};

export default RecordsTable;
