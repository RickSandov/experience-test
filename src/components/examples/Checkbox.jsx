import { useCallback, useState } from 'react';
import {
    Checkbox,
    FormControl,
    FormGroup,
    FormLabel,
    FormControlLabel,
    Typography,
    makeStyles
} from '@ellucian/react-design-system/core';
import { spacing600 } from '@ellucian/react-design-system/core/styles/tokens';

const useStyles = makeStyles()((theme) => ({
    root: {},
    group: {
        display: 'flex',
        [theme.breakpoints.up('md')]: {
            flexDirection: 'row',
        },
        [theme.breakpoints.down('md')]: {
            flexDirection: 'column',
        },
    },
    label: {
        marginRight: theme.spacing(4),
    },
    ariaLabelledPadding: {
        paddingTop: spacing600,
        display: 'flex',
        alignItems: 'center',
    },
}));

// selection states
const CHECKED = 0;
const INDETERMINATE = 1;
const NONE = 2;

/**
 * Labeled Checkboxes
 */
const LabeledCheckboxes = () => {
    const customId = 'LabeledCheckboxes';
    const { classes } = useStyles();
    const [state, setState] = useState({
        checkedA: true,
        checkedB: false,
        checkedE: INDETERMINATE,
        checkedG: true,
    });

    const handleChange = useCallback((name) => (event) => {
        setState((prev) => ({ ...prev, [name]: event.target.checked }));
    }, []);

    const handleChangeIndeterminate = useCallback((name) => () => {
        setState((prev) => {
            let checkboxState;

            switch (prev[name]) {
                case NONE: checkboxState = INDETERMINATE; break;
                case INDETERMINATE: checkboxState = CHECKED; break;
                case CHECKED: checkboxState = NONE; break;
                default: checkboxState = NONE; break;
            }

            return {
                ...prev,
                [name]: checkboxState,
            };
        });
    }, []);

    return (
        <FormControl id={`${customId}_Container`} component="fieldset" className={classes.root}>
            <FormLabel component="legend">Checkbox variants</FormLabel>
            <FormGroup
                className={classes.group}
                row
                id={`${customId}_CheckboxContainer`}>
                <FormControlLabel
                    className={classes.label}
                    control={
                        <Checkbox
                            checked={state.checkedA}
                            onChange={handleChange('checkedA')}
                            value="checkedA"
                        />
                    }
                    id={`${customId}_CheckboxA`}
                    label="Selected"
                />
                <FormControlLabel
                    className={classes.label}
                    control={
                        <Checkbox
                            checked={state.checkedE === CHECKED}
                            onChange={handleChangeIndeterminate('checkedE')}
                            value="checkedE"
                            indeterminate={state.checkedE === INDETERMINATE}
                        />
                    }
                    id={`${customId}_CheckboxE`}
                    label="Indeterminate"
                />
                <FormControlLabel
                    className={classes.label}
                    control={
                        <Checkbox
                            checked={state.checkedB}
                            onChange={handleChange('checkedB')}
                            value="checkedB"
                        />
                    }
                    id={`${customId}_CheckboxB`}
                    label="Unselected"
                />
                <FormControlLabel
                    className={classes.label}
                    control={
                        <Checkbox
                            onChange={handleChange('checkedC')}
                            value="checkedC"
                        />
                    }
                    disabled
                    id={`${customId}_CheckboxC`}
                    label="Unselected and disabled"
                />
                <FormControlLabel
                    className={classes.label}
                    control={
                        <Checkbox
                            indeterminate
                            onChange={handleChange('checkedF')}
                            value="checkedF"
                        />
                    }
                    disabled
                    id={`${customId}_CheckboxF`}
                    label="Indeterminate and disabled"
                />
                <FormControlLabel
                    className={classes.label}
                    control={
                        <Checkbox
                            checked
                            onChange={handleChange('checkedD')}
                            value="checkedD"
                        />
                    }
                    disabled
                    id={`${customId}_CheckboxD`}
                    label="Selected and disabled"
                />
            </FormGroup>
            <div className={classes.ariaLabelledPadding}>
                <Typography className={classes.blockDisplay} id="checkbox_label_G">
                    Checkbox labeled using aria-labelledby
                </Typography>
                <Checkbox
                    inputProps={{
                        'aria-labelledby': 'checkbox_label_G',
                    }}
                    checked={state.checkedG}
                    onChange={handleChange('checkedG')}
                    value="checkedG"
                />
            </div>
        </FormControl>
    );
};

export default LabeledCheckboxes;