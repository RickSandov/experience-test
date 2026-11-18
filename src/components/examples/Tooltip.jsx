import {
    makeStyles,
    Tooltip,
    Button,
    Typography,
    Avatar,
    IconButton
} from '@ellucian/react-design-system/core';
import { Icon } from '@ellucian/ds-icons/lib';

const customId = 'SimpleTooltips';

const useStyles = makeStyles({ name: 'EdsSimpleTooltips' })(() => ({
    spaced: {
        marginBottom: '2rem',
    },
}));

/**
 * Simple Tooltip
 */
function SimpleTooltips() {
    const { classes } = useStyles();
    const tooltipMax = 'Add to calendar - lorem ipsum many web sites still in infancy versions have evolved over the years.';

    return (
        <div id={`${customId}_Container`}>
            <div id={`${customId}_Table`}>
                <Tooltip id="tooltip-icon" title="Delete">
                    <IconButton aria-label="delete" className={classes.spaced}>
                        <Icon name="trash" title="trash icon" />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Save" describeChild >
                    <Avatar
                        className={classes.spaced}
                        id="IconAvatar">
                        <Icon
                            name="save"
                            aria-label="Save"
                            className={classes.iconColor}
                            id="saveicon"
                        />
                    </Avatar>
                </Tooltip>
                <Typography variant="h2" gutterBottom>
                    Tooltip - Max Width
                </Typography>
                <Tooltip id="tooltip-button" title={tooltipMax}>
                    <Button color="primary" className={classes.spaced}>
                        Add to calendar
                    </Button>
                </Tooltip>
                <Typography variant="h2" gutterBottom>
                    Controlled Tooltips (Custom Delays)
                </Typography>
                <Tooltip id="tooltip-icon-copy"
                    enterDelay={500}
                    leaveDelay={1000}
                    title="Copy">
                    <IconButton aria-label="Copy">
                        <Icon name="copy" title="copy icon" />
                    </IconButton>
                </Tooltip>
            </div>
        </div>
    );
}

export default SimpleTooltips;
