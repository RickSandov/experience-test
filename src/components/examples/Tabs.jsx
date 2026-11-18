import { useState } from 'react';
import {
    Tabs,
    Tab,
    Typography,
    Switch,
    FormControlLabel,
    StatusLabel,
    makeStyles,
    useWidth
} from '@ellucian/react-design-system/core';

/**
 * Card Level Tabs with Automatic Scroll Buttons
 */
const DisabledTabs = () => {
    const [value, setValue] = useState(2);
    const customId = 'DisabledExample';

    const handleChange = (event, nextValue) => {
        setValue(nextValue);
    };

    return (
        <div id={`${customId}_Container`}>
            <Tabs
                id={`${customId}_Tabs`}
                onChange={handleChange}
                value={value}
                variant="card"
                scrollButtons
            >
                <Tab id={`${customId}_Tab0`} label="Manage Advisees" />
                <Tab id={`${customId}_Tab1`} label="Authorize Registration" disabled />
                <Tab id={`${customId}_Tab2`} label="Shared Advisees" />
            </Tabs>
        </div>
    );
};


import { widthFluid } from '@ellucian/react-design-system/core/styles/tokens';

const useStyles = makeStyles()((theme) => ({
    root: {
        flexGrow: 1,
        width: widthFluid,
        marginTop: theme.spacing(3),
        backgroundColor: theme.palette.background.paper,
    },
}));

/**
 * Page Level Tabs with Automatic Scroll Buttons
 */
const ScrollableButtonTab = () => {
    const { classes } = useStyles();
    const width = useWidth();
    const [value, setValue] = useState(0);
    const [showScrollButtons, setShowScrollButtons] = useState(true);
    const customId = 'ScrollableExample';

    const handleChange = (event, nextValue) => {
        setValue(nextValue);
    };

    const handleSwitchChange = (event, nextValue) => {
        setShowScrollButtons(nextValue);
    };

    return (
        <div className={classes.root} id={`${customId}_Container`}>
            <Typography paragraph>
                If tabs exceed the width of the viewport, they can slide left to right with the use of scroll buttons.
                Scroll buttons will be shown automatically if tabs need to be scrolled.
                <br />
                <br />
                <StatusLabel type="pending" text="Note" /> By default scroll buttons are hidden on mobile and
                can be shown by passing <code>allowScrollButtonsMobile={'true'}</code> prop
            </Typography>
            <Tabs
                id={`${customId}_Tabs`}
                onChange={handleChange}
                scrollButtons
                allowScrollButtonsMobile={showScrollButtons}
                value={value}
            >
                <Tab id={`${customId}_Tab0`} label="Award Offer" />
                <Tab
                    id={`${customId}_Tab1`}
                    label="Financial Aid History"
                />
                <Tab
                    id={`${customId}_Tab2`}
                    label="Current Satisfactory Academic Progress for Degree"
                />
                <Tab id={`${customId}_Tab3`} label="Resources" />
                <Tab id={`${customId}_Tab4`} label="Notifications" />
            </Tabs>
            {width === 'xs' &&
                <FormControlLabel
                    control={
                        <Switch
                            id={`${customId}_switch`}
                            checked={showScrollButtons}
                            onChange={handleSwitchChange}
                            value="showScrollButtons"
                        />
                    }
                    label="Show scroll buttons in mobile"
                />
            }
        </div>
    );
};


export { DisabledTabs, ScrollableButtonTab };
