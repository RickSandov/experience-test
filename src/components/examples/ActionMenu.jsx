import { useState } from 'react';
import {
    Edit,
    Applications,
    CalendarDelete
} from '@ellucian/ds-icons/lib';
import { Typography, ActionMenu, ActionMenuItem, makeStyles } from '@ellucian/react-design-system/core';
import {
    spacing300,
} from '@ellucian/react-design-system/core/styles/tokens';

const useStyles = makeStyles({
    name: 'EdsActionMenuItemWithIconAndLabel'
})((theme) => ({
    root: {
        marginBottom: spacing300
    },
    actionMenuContainer: {
        backgroundColor: theme.palette.action.disabled,
        padding: '0.2rem 1rem',
        position: 'relative',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    }
}));

const customId = 'ActionMenuWithIcon';

/**
 * ActionMenu item with icon and label
 */
const ActionMenuItemWithIconAndLabel = () => {
    const [actionLabel, setActionLabel] = useState('');
    const { classes } = useStyles();

    return (
        <div id={`${customId}_Container`}>
            <div className={classes.actionMenuContainer}>
                <Typography gutterBottom style={{ display: 'inline-block' }}>
                    {`Clicked on ${actionLabel}`}
                </Typography>
                <div>
                    <ActionMenu>
                        <ActionMenuItem onClick={e => setActionLabel(e.target.innerText)}>
                            <Edit />
                            Edit
                        </ActionMenuItem>
                        <ActionMenuItem onClick={e => setActionLabel(e.target.innerText)}>
                            <Applications />
                            Add new
                        </ActionMenuItem>
                        <ActionMenuItem onClick={e => setActionLabel(e.target.innerText)}>
                            <CalendarDelete />
                            Delete
                        </ActionMenuItem>
                    </ActionMenu>
                </div>
            </div>
        </div>
    );
};



export default ActionMenuItemWithIconAndLabel;
