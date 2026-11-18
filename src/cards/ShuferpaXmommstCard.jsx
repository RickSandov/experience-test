import { spacing40 } from '@ellucian/react-design-system/core/styles/tokens';
import { makeStyles, Typography, Button } from '@ellucian/react-design-system/core';
import { useCardControl } from '@ellucian/experience-extension-utils';
import QueryProvider from '../contexts/QueryProvider';

const useStyles = makeStyles({ name: 'XmommstCard' })(() => ({
    card: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: spacing40,
        margin: `0 ${spacing40}`
    }
}));

const ShuferpaXmommstCardContent = () => {
    const { classes } = useStyles();
    const { navigateToPage } = useCardControl();

    return (
        <div className={classes.card}>
            <Typography>
                Look up and manage XMOMMST access records by Banner ID.
            </Typography>
            <Button id="XmommstCard_Open" onClick={() => navigateToPage({ route: '/' })}>
                Open
            </Button>
        </div>
    );
};

const ShuferpaXmommstCard = (props) => (
    <QueryProvider>
        <ShuferpaXmommstCardContent {...props} />
    </QueryProvider>
);

export default ShuferpaXmommstCard;
