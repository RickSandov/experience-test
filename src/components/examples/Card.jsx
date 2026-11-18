import { Fragment, useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Card,
    CardHeader,
    CardContent,
    Typography,
    IconButton,
    FormControlLabel,
    Checkbox,
    StatusLabel,
    TextLink,
    makeStyles,
} from '@ellucian/react-design-system/core';
import {
    MoreVertical,
    ExternalLink,
    Bookmark
} from '@ellucian/ds-icons/lib';

const useStyles = makeStyles({
    name: 'EdsSubtitleHeaderActionsCard'
})(theme => ({
    content: {
        height: '15rem',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.palette.grey[300],
    }
}));

/**
 * Subtitle, Header actions, and CardContent spacing
 */
const SubtitleHeaderActionsCard = () => {
    const { classes } = useStyles();
    const [negate, setNegate] = useState(false);

    return (
        <Fragment>
            <Typography paragraph component="div">
                <StatusLabel text="NOTES" type="pending" />
                <ul>
                    <li>
                        Use <code>subheader</code> prop of <code>CardHeader</code> component to add sub title for <code>Card</code>.
                    </li>
                    <li>
                        Use <code>action</code> prop of <code>CardHeader</code> component to add actions to header.
                        If there are multiple actions, make sure to wrap them in a container or <code>Fragment</code>.
                        Make sure to use <TextLink component={Link} to="/design-guidelines/iconography">icons</TextLink> from the
                        component library, or SVGs.
                    </li>
                    <li>
                        Use <code>spacingOptions.negateSpacingAll</code> prop of <code>CardContent</code> component to remove spacing.
                    </li>
                </ul>
            </Typography>
            {/* Example core code */}
            <Card>
                <CardHeader title="Some Card Title" subheader="Some Card Sub Title"
                    // Wrap with container for more than one action
                    action={
                        <Fragment>
                            <IconButton color="gray" aria-label="More">
                                <MoreVertical />
                            </IconButton>
                            <IconButton color="gray" aria-label="External link">
                                <ExternalLink />
                            </IconButton>
                            <IconButton color="gray" aria-label="Bookmark">
                                <Bookmark />
                            </IconButton>
                        </Fragment>
                    }
                />

                {/* Set the negateSpacingAll for CardConent here */}
                <CardContent spacingOptions={{ negateSpacingAll: negate }}>
                    <div className={classes.content}>
                        <Typography variant="h2" color="textSecondary">Card Content</Typography>
                    </div>
                </CardContent>
            </Card>
            <br />
            {/* Below code is just for demo purposes */}
            <FormControlLabel
                control={
                    <Checkbox
                        checked={negate}
                        onChange={() => setNegate(!negate)}
                    />
                }
                label="Remove card content spacing"
            />
        </Fragment>
    );
};

export default SubtitleHeaderActionsCard;