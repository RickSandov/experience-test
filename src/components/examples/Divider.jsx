import {
    makeStyles,
    Paper,
    Divider,
    Typography
} from '@ellucian/react-design-system/core';
import { spacing500 } from '@ellucian/react-design-system/core/styles/tokens';

const useStyles = makeStyles({ name: 'EdsFullWidthDividerExample' })(theme => ({
    defaultPaper: {
        width: '21.4375rem',
        height: '11rem',
        padding: '1rem 0rem 1rem 0rem'
    },
    middlePaper: {
        width: '21.4375rem',
        height: '11.25rem',
        padding: spacing500,
    },
    nameText: {
        fontSize: theme.typography.h2.fontSize,
        paddingLeft: spacing500,
    },
    idText: {
        fontSize: theme.typography.fontSize,
        paddingLeft: spacing500,
    },
    typography: {
        margin: theme.spacing(2),
    },
}));

const customId = 'Divider';

/**
 * FullWidth Divider
 */
const FullWidthDividerExamples = () => {
    const { classes } = useStyles();

    return (
        <div id={`${customId}_Container`}>
            <div id={`${customId}_DefaultExample`}>
                <Paper className={classes.defaultPaper} id={`${customId}_CardDefault`}>
                    <Typography className={classes.nameText}>Alfred, Don</Typography>
                    <Typography className={classes.idText}>000-006-461</Typography>
                    <Divider id={`${customId}_FullWidthExample`} />
                    <Typography className={classes.nameText}>Anderson, Andy J.</Typography>
                    <Typography className={classes.idText}>000-006-462</Typography>
                </Paper>
            </div>
            <br />
            <Typography className={classes.typography} variant="body2">
                The default Divider styling can appear to have middle styling if the surrounding container has padding.
            </Typography>
            <div id={`${customId}_WithPaddingExample`}>
                <Paper className={classes.middlePaper} id={`${customId}_CardWithPadding`}>
                    <Typography className={classes.nameText}>Alfred, Don</Typography>
                    <Typography className={classes.idText}>000-006-461</Typography>
                    <Divider id={`${customId}_WithPaddingExample`} />
                    <Typography className={classes.idText}>Undergrad BS Painting</Typography>
                    <Typography className={classes.idText}>Freshman</Typography>
                    <Typography className={classes.idText}>Added: 7-10-2017</Typography>
                </Paper>
            </div>
        </div>
    );
};

// hide-code-start
FullWidthDividerExamples.documentationElement = (
    <Typography gutterBottom>
        Separate content into sections and span the entire length of the container.<br />
        By default, the <code>Divider</code> component will apply full-width styling.
    </Typography>
);
// hide-code-end
export default FullWidthDividerExamples;
