import { useState, Fragment } from 'react';
import { Link } from 'react-router-dom';

import {
    Drawer,
    Button,
    Divider,
    List,
    ListItemButton,
    ListItemText,
    makeStyles
} from '@ellucian/react-design-system/core';

import { spacing500 } from '@ellucian/react-design-system/core/styles/tokens';

const useStyles = makeStyles({
    name: 'EdsTemporaryDrawer'
})({
    fullList: {
        width: 'auto',
    },
    margin: {
        marginRight: spacing500,
    }
});

/**
 * Temporary Drawer
 */
export default function TemporaryDrawer() {
    const { classes, cx } = useStyles();
    const [state, setState] = useState({
        top: false,
        left: false,
        bottom: false,
        right: false,
    });

    const toggleDrawer = (anchor, open) => (event) => {
        //Ignore these keys so that the drawer isn't closed before other events can fire.
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift' || event.key === 'Enter')) {
            return;
        }

        setState({ ...state, [anchor]: open });
    };

    const gettingStarted = ['Contribute', 'Getting Started', 'Custom Theming', 'The sx prop'];
    const designGuidelines = ['Accessibility', 'Backgrounds', 'Color', 'Favicon', 'Iconography', 'Illustration', 'Logo', 'Typography', 'Writing Standards', 'Z-Index'];

    const list = (anchor) => (
        <div
            className={cx(classes.list, {
                [classes.fullList]: anchor === 'top' || anchor === 'bottom',
            })}
            role="presentation"
            onClick={toggleDrawer(anchor, false)}
            onKeyDown={toggleDrawer(anchor, false)}
        >
            <List>
                {gettingStarted.map((text) => (
                    <ListItemButton
                        key={text}
                        component={Link}
                        to={'/getting-started/' + text.toLowerCase().replace(' ', '-')}
                    >
                        <ListItemText primary={text} />
                    </ListItemButton>
                ))}
            </List>
            <Divider />
            <List>
                {designGuidelines.map((text) => (
                    <ListItemButton
                        key={text}
                        component={Link}
                        to={'/design-guidelines/' + text.toLowerCase().replace(' ', '-')}
                    >
                        <ListItemText primary={text} />
                    </ListItemButton>
                ))}
            </List>
        </div>
    );

    return (
        <div>
            {['left', 'right', 'top', 'bottom'].map((anchor) => (
                <Fragment key={anchor}>
                    <Button onClick={toggleDrawer(anchor, true)} aria-expanded={state[anchor]} aria-haspopup="true" aria-controls={anchor} className={classes.margin}>{anchor}</Button>
                    <Drawer id={anchor} PaperProps={{ component: 'nav' }} anchor={anchor}
                        open={state[anchor]}
                        onClose={toggleDrawer(anchor, false)}
                    >
                        {list(anchor)}
                    </Drawer>
                </Fragment>
            ))}
        </div>
    );
}

