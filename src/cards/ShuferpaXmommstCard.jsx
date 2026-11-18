import { spacing40 } from '@ellucian/react-design-system/core/styles/tokens';
import { makeStyles, Typography, TextLink } from '@ellucian/react-design-system/core';
import QueryProvider from '../contexts/QueryProvider';

const useStyles = makeStyles()({
    card: {
        margin: `0 ${spacing40}`,
    }
});

const ShuferpaXmommstCardContent = () => {
    const { classes } = useStyles();

    return (
        <div className={classes.card}>
            <Typography variant="h2">
                Hello ShuferpaXmommst World
            </Typography>
            <Typography>
                <span>
                    For sample extensions, visit the Ellucian Developer
                </span>
                <TextLink href="https://github.com/ellucian-developer/experience-extension-sdk-samples" target="_blank">
                     GitHub
                </TextLink>
            </Typography>
        </div>
    );
};

const ShuferpaXmommstCard = (props) => (
    <QueryProvider>
        <ShuferpaXmommstCardContent {...props} />
    </QueryProvider>
);

export default ShuferpaXmommstCard;
