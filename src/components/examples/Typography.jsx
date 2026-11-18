import { makeStyles, Typography } from '@ellucian/react-design-system/core';
import {
    fontWeightBold,
    fontSizeHeader1,
    fontSizeHeader1Small,
    fontSizeHeader2,
    fontSizeHeader2Small,
    fontSizeHeader3,
    fontSizeHeader3Small,
    fontSizeHeader4,
    fontSizeHeader4Small,
    fontSizeHeader5,
    fontSizeHeader5Small,
    fontSizeHeader6,
    fontSizeLarge,
    fontSizeDefault,
    fontSizeSmall,
} from '@ellucian/react-design-system/core/styles/tokens';

const useStyles = makeStyles({ name: 'EdsTypographyExample' })(theme => ({
    sectionHeaders: {
        paddingTop: theme.spacing(7.5),
        fontWeight: fontWeightBold,
    },
    section: {
        paddingBottom: theme.spacing(7.5),
    },
    circumscribed: {
        border: '1px solid',
    },
}));

const customId = 'Typography';

const lotsaText = `
It was the best of times, it was the worst of times, it was the age of wisdom, it was the age of foolishness,
it was the epoch of belief, it was the epoch of incredulity, it was the season of light, it was the season of
darkness, it was the spring of hope, it was the winter of despair.
`;

const lotsaArabicText = `
كان أفضل الأوقات ، كان أسوأ الأوقات ، كان عصر الحكمة ، كان عصر الحماقة ،
كان عصر الإيمان ، كان عصر الشك ، كان موسم النور ، كان موسم
الظلام ، كان ربيع الأمل ، كان شتاء اليأس.
كان أفضل الأوقات ، كان أسوأ الأوقات ، كان عصر الحكمة ، كان عصر الحماقة ،
كان عصر الإيمان ، كان عصر الشك ، كان موسم النور ، كان موسم
الظلام ، كان ربيع الأمل ، كان شتاء اليأس.
`;

const variantInfo = [
    {
        variant: 'h1',
        description: 'h1. Heading',
        sampleText: 'The Leader in Higher Education',
        domMapping: `<h1> (lg/md font size: ${fontSizeHeader1}; sm/xs font size: ${fontSizeHeader1Small})`,
    },
    {
        variant: 'h2',
        description: 'h2. Heading',
        sampleText: 'The Leader in Higher Education',
        domMapping: `<h2> (lg/md font size: ${fontSizeHeader2}; sm/xs font size: ${fontSizeHeader2Small})`,
    },
    {
        variant: 'h3',
        description: 'h3. Heading',
        sampleText: 'The leader in higher education',
        domMapping: `<h3> (lg/md font size: ${fontSizeHeader3}; sm/xs font size: ${fontSizeHeader3Small})`,
    },
    {
        variant: 'h4',
        description: 'h4. Heading',
        sampleText: 'The leader in higher education',
        domMapping: `<h4> (lg/md font size: ${fontSizeHeader4}; sm/xs font size: ${fontSizeHeader4Small})`,
    },
    {
        variant: 'h5',
        description: 'h5. Heading',
        sampleText: 'The leader in higher education',
        domMapping: `<h5> (lg/md font size: ${fontSizeHeader5}; sm/xs font size: ${fontSizeHeader5Small})`,
    },
    {
        variant: 'h6',
        description: 'h6. Heading',
        sampleText: 'The leader in higher education',
        domMapping: `<h6> (font size: ${fontSizeHeader6})`,
    },
    {
        variant: 'body1',
        description: 'body1. A standard body text with the baseline size.',
        sampleText: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent libero eros, convallis vitae nisi eget, accumsan tincidunt sapien. Maecenas nec sapien aliquam, pretium urna et, lacinia magna. Nulla facilisi. Vivamus eu rutrum felis. Morbi malesuada nec odio quis placerat. Maecenas rhoncus auctor velit, mollis viverra neque auctor placerat.',
        domMapping: `<p> (font size: ${fontSizeLarge})`
    },
    {
        variant: 'body2',
        description: 'body2. A smaller and more compact alternate sans-serif body text.',
        sampleText: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent libero eros, convallis vitae nisi eget, accumsan tincidunt sapien. Maecenas nec sapien aliquam, pretium urna et, lacinia magna. Nulla facilisi. Vivamus eu rutrum felis. Morbi malesuada nec odio quis placerat. Maecenas rhoncus auctor velit, mollis viverra neque auctor placerat.',
        domMapping: `<p> (font size: ${fontSizeDefault})`
    },
    {
        variant: 'body3',
        description: 'body3. The smallest sans-serif body text.',
        sampleText: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent libero eros, convallis vitae nisi eget, accumsan tincidunt sapien. Maecenas nec sapien aliquam, pretium urna et, lacinia magna. Nulla facilisi. Vivamus eu rutrum felis. Morbi malesuada nec odio quis placerat. Maecenas rhoncus auctor velit, mollis viverra neque auctor placerat.',
        domMapping: `<p> (font size: ${fontSizeSmall})`
    },
    {
        variant: 'caption',
        description: 'caption. Small, condensed text for labeling.',
        sampleText: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent libero eros, convallis vitae nisi eget, accumsan tincidunt sapien. Maecenas nec sapien aliquam, pretium urna et, lacinia magna. Nulla facilisi. Vivamus eu rutrum felis. Morbi malesuada nec odio quis placerat. Maecenas rhoncus auctor velit, mollis viverra neque auctor placerat.',
        domMapping: `<span> (font size: ${fontSizeDefault})`
    },
];


/**
 * Typography Variants
 */
const TypographyExample = () => {
    const { classes } = useStyles();

    return (
        <section id={`${customId}_Container`}>
            {/* variants*/}
            <div id={`${customId}_Example`}>
                <Typography id={`${customId}_BasicExample`} />
                {variantInfo.map(info => {
                    return (
                        <div key={`${info.variant}_div`}>
                            <Typography className={classes.sectionHeaders} key={`${info.variant}_header`} variant={info.variant} gutterBottom>
                                {info.description}
                            </Typography>

                            <Typography variant={info.variant} gutterBottom>
                                {info.sampleText ? info.sampleText : 'The leader in higher education.'}
                            </Typography>

                            <ul>
                                <li> <Typography variant="body2"><strong>Variant</strong>: {info.variant} </Typography> </li>
                                {info.domMapping &&
                                    <li> <Typography variant="body2"><strong>DOM Element</strong>: {info.domMapping} </Typography> </li>
                                }
                            </ul>

                        </div>
                    );
                })}

                {/* {headerExamples(classes)} */}

            </div>

            {/* alignment */}
            <Typography variant="h2" className={classes.sectionHeaders} gutterBottom>
                Alignment
            </Typography>

            {['left', 'center', 'right', 'justify'].map(alignment => {
                return (
                    <div key={alignment} className={classes.section}>
                        <Typography variant="body2">
                            Align {alignment}
                        </Typography>
                        <Typography align={alignment}>
                            {lotsaText}
                        </Typography>
                    </div>
                );
            })}

            {/* nowrap */}
            <Typography variant="h2" className={classes.sectionHeaders} gutterBottom>
                No Wrap
            </Typography>

            {[false, true].map(bool => {
                return (
                    <div key={bool} className={classes.section}>
                        <Typography variant="body2">
                            noWrap is {bool ? 'true' : 'false'}
                        </Typography>
                        <Typography noWrap={bool}>
                            {lotsaText}
                        </Typography>
                    </div>
                );
            })}

            {/* rtl */}
            <Typography variant="h2" className={classes.sectionHeaders} gutterBottom>
                Localizing Typography (RTL)
            </Typography>
            <Typography>
                The text direction in Typography will follow whatever the locale is.
            </Typography>
            <Typography gutterBottom>
                When using Typography with noWrap and locale is different from the language provided, you will need to apply <code>dir={'auto'}</code> for the text to be truncated properly. <br />
            </Typography>

            {[false, true].map(bool => {
                return (
                    <div key={bool} className={classes.section}>
                        <Typography variant="body2">
                            dir is {bool ? 'set' : 'not set'} to auto.
                        </Typography>
                        <div className={classes.circumscribed}>
                            <Typography dir={bool ? 'auto' : null} noWrap>
                                {lotsaText}
                            </Typography>
                            <Typography dir={bool ? 'auto' : null} noWrap>
                                {lotsaArabicText}
                            </Typography>
                        </div>
                    </div>
                );
            })}

            {/* gutterBottom */}
            <Typography variant="h2" className={classes.sectionHeaders} gutterBottom>
                gutterBottom property
            </Typography>
            <Typography paragraph>
                Adds <code>margin-bottom: 0.35em</code> to a Typography element.
            </Typography>

            {[false, true].map(bool => {
                return (
                    <div key={bool} className={classes.section}>
                        <Typography variant="body2">
                            gutterBottom is {bool ? 'true' : 'false'}
                        </Typography>
                        <div className={classes.circumscribed}>
                            <Typography gutterBottom={bool}>
                                {lotsaText}
                            </Typography>
                        </div>
                    </div>
                );
            })}

            {/* paragraph property */}
            <Typography variant="h2" className={classes.sectionHeaders} gutterBottom>
                paragraph property
            </Typography>
            <Typography paragraph>
                Adds <code>margin-bottom: 16px</code> to a Typography element.
            </Typography>

            {[false, true].map(bool => {
                return (
                    <div key={bool} className={classes.section}>
                        <Typography variant="body2">
                            paragraph is {bool ? 'true' : 'false'}
                        </Typography>
                        <div className={classes.circumscribed}>
                            <Typography paragraph={bool}>
                                {lotsaText}
                            </Typography>
                        </div>
                    </div>
                );
            })}

            {/* color property */}
            <Typography variant="h2" className={classes.sectionHeaders} gutterBottom>
                color property
            </Typography>

            {['initial', 'error', 'textPrimary', 'textSecondary'].map(color => {
                return (
                    <div key={color} className={classes.section}>
                        <Typography variant="body2">
                            Color: {color}
                        </Typography>
                        <Typography color={color}>
                            The leader in higher education technology
                        </Typography>
                    </div>
                );
            })}

        </section>
    );
};

export default TypographyExample;
