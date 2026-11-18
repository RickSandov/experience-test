

import {
    AdvancedTable,
    StatusLabel,
    Avatar,
    AvatarGroup,
    IconButton,
    Badge,
    Chip,
    TextLink,
    Paper
} from '@ellucian/react-design-system/core';

import { Edit as EditIcon } from '@ellucian/ds-icons/lib';

const columns = [
    {
        accessorKey: 'lastName',
        header: 'Last Name',
        editType: 'text',
    },
    {
        accessorKey: 'age',
        header: 'Age',
        editType: 'text',
        editTextFieldProps: {
            type: 'number',
            step: 1,
            max: 100,
            min: 0
        },
    },
    {
        accessorKey: 'dob',
        header: 'DOB',
        editType: 'date',
        editDatePickerProps: {
            minDate: new Date('01/01/1970'),
        }
    },
    {
        accessorKey: 'state',
        header: 'State',
        editType: 'dropdown',
        editDropdownProps: {
            label: 'State',
            options: [
                { label: 'Ohio', value: 'ohio' },
                { label: 'Kentucky', value: 'kentucky' },
                { label: 'Nebraska', value: 'nebraska' },
                { label: 'South Carolina', value: 'south-carolina' },
                { label: 'West Virginia', value: 'west-virginia' }
            ]
        }
    },
    {
        accessorKey: 'sms',
        header: 'SMS',
        editType: 'checkbox',
        size: 100,
    },
    {
        accessorKey: 'notifications',
        header: 'Notifs',
        editType: 'switch',
        size: 100,
    }
];

const data = [
    {
        firstName: 'Dylan',
        lastName: 'Murray',
        age: 28,
        dob: undefined,
        state: 'kentucky',
        sms: false,
        notifications: true,
    },
    {
        firstName: 'Raquel',
        lastName: 'Kohler',
        age: 34,
        dob: '01/1/1989',
        state: 'ohio',
        sms: true,
        notifications: false,
    },
    {
        firstName: 'Ervin',
        lastName: 'Reinger',
        age: 45,
        dob: null,
        state: 'west-virginia',
        sms: false,
        notifications: true,
    },
];

/**
 *
 * Editable
 */
const EditableAdvancedTable = () => (
    <Paper sx={{ p: '.5rem' }}>
        <AdvancedTable
            columns={columns}
            data={data}
            enableEditing={true}
        />
    </Paper>
);

// Custom component wrappers for each cell type
const StatusCell = ({ row }) => (
    <StatusLabel text={row.original.status} type={row.original.statusType} />
);

const AvatarCell = ({ row }) => {
    const avatarUrl = row.original.avatarUrl;
    return Array.isArray(avatarUrl) ? (
        <AvatarGroup>
            {avatarUrl.map((name, index) => (
                <Avatar key={index} alt={name}>
                    {name}
                </Avatar>
            ))}
        </AvatarGroup>
    ) : (
        <Avatar src={avatarUrl} alt="Avatar" />
    );
};

const IconButtonCell = ({ row }) => (
    <IconButton onClick={() => console.log('Edit', row.original)} color="gray">
        <EditIcon />
    </IconButton>
);

const BadgeCell = ({ row }) => (
    <Badge badgeContent={row.original.notifications} color="primary" sx={{
        '& span': {
            ml: 0
        }
    }} />
);

const ChipCell = ({ row }) => (
    <Chip
        label={row.original.role}
        color="secondary"
        variant="outlined"
        activated={row.original.activated}
    />
);

const TextLinkCell = ({ row }) => (
    <TextLink href={row.original.profile} target="_blank" rel="noopener">
        View Profile
    </TextLink>
);

/**
 * Custom Cell Components
 */
const CustomCellComponents = () => {
    const columns = [
        {
            accessorKey: 'status',
            header: 'Status Label',
            Cell: StatusCell,
            enableEditing: false,
        },
        {
            enableEditing: false,
            accessorKey: 'avatarUrl',
            header: 'Avatar',
            Cell: AvatarCell,
        },
        {
            enableEditing: false,
            accessorKey: 'name',
            header: 'Icon Button',
            Cell: IconButtonCell,
        },
        {
            enableEditing: false,
            accessorKey: 'notifications',
            header: 'Badge',
            Cell: BadgeCell,
        },
        {
            enableEditing: false,
            accessorKey: 'role',
            header: 'Chip',
            Cell: ChipCell,
        },
        {
            enableEditing: false,
            accessorKey: 'profile',
            header: 'Text Link',
            Cell: TextLinkCell,
        },
    ];

    const data = [
        {
            name: 'Alice Johnson',
            status: 'Active',
            statusType: 'success',
            avatarUrl: 'https://i.pravatar.cc/150?img=1',
            notifications: 3,
            role: 'Admin',
            profile: 'https://example.com/alice',
            activated: true,
        },
        {
            name: 'Bob Smith',
            status: 'Inactive',
            statusType: 'error',
            avatarUrl: ['AB', 'BR', 'JJ', 'JK'],
            notifications: 0,
            role: 'Editor',
            profile: 'https://example.com/bob',
        },
        {
            name: 'Carol White',
            status: 'Idle',
            statusType: 'draft',
            avatarUrl: 'https://i.pravatar.cc/150?img=3',
            notifications: 5,
            role: 'Viewer',
            profile: 'https://example.com/carol',
            activated: true,
        },
    ];

    return (
        <Paper sx={{ p: '.5rem' }}>
            <AdvancedTable
                data={data}
                columns={columns}
                enableEditing={true}
            />
        </Paper>
    );
};


export {
    CustomCellComponents, EditableAdvancedTable
};