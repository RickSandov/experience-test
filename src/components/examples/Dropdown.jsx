import { useCallback, useState } from 'react';

import {
    Button,
    Checkbox,
    Dropdown,
    DropdownItem,
    FormControl,
    FormControlLabel,
    makeStyles,
} from '@ellucian/react-design-system/core';
import { widthInputFields } from '@ellucian/react-design-system/core/styles/tokens';

const useStyles = makeStyles()(() => ({
    formControl: {
        maxWidth: widthInputFields,
    }
}));

const stringOptions = [
    'Mechanical Engineering',
    'Environmental and Energy Management',
    'Renewable Energy Engineering',
    'Electrical Engineering',
    'Biomedical System Engineering',
    'Civil Engineering/Civil Engineering Technician',
    'Information Science and Engineering',
];

/**
 * Disabled and Error Dropdown
 */
const DisabledAndErrorDropdownExample = () => {
    const { classes } = useStyles();
    const customId = 'DisabledAndErrorDropdownExample';
    const [degrees, setDegrees] = useState('');
    const [isRequired, setIsRequired] = useState(true);
    const [error, setError] = useState(false);

    const handleChange = useCallback((event) => {
        const value = event.target.value;
        setDegrees(value);
        setError(value === '');
    }, []);

    const handleBlur = useCallback((event) => {
        setError(event.target.value === '');
    }, []);

    const toggleRequired = useCallback(() => {
        setIsRequired((prev) => !prev);
    }, []);

    const toggleError = useCallback(() => {
        setError((prev) => !prev);
    }, []);

    const resetValue = useCallback(() => {
        setDegrees('');
    }, []);

    return (
        <div>
            <FormControl
                className={classes.formControl}
                id={`${customId}_DisabledDropdownContainer`}
            >
                <Dropdown
                    disabled
                    id={`${customId}_DisabledDropdown`}
                    label="Degrees"
                    onChange={handleChange}
                    value={degrees}
                    required
                >
                    {stringOptions.map((option) => (
                        <DropdownItem
                            key={option}
                            label={option}
                            value={option}
                        />
                    ))}
                </Dropdown>
            </FormControl>

            <br />
            <br />

            <FormControl
                className={classes.formControl}
                id={`${customId}_ErrorDropdownContainer`}
            >
                <Dropdown
                    error={error}
                    id={`${customId}_Dropdown`}
                    helperText={
                        isRequired && error
                            ? degrees === ''
                                ? 'A degree must be selected'
                                : 'Displaying the error styling'
                            : null
                    }
                    label="Degrees"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={degrees}
                    required={isRequired}
                >
                    {stringOptions.map((option) => (
                        <DropdownItem
                            key={option}
                            label={option}
                            value={option}
                        />
                    ))}
                </Dropdown>
                <FormControlLabel
                    id={`${customId}_toggleRequired`}
                    control={(
                        <Checkbox
                            checked={isRequired}
                            onChange={toggleRequired}
                        />
                    )}
                    label="Required"
                />

                <br />

                <FormControlLabel
                    id={`${customId}_toggleError`}
                    control={(
                        <Checkbox
                            checked={error}
                            onChange={toggleError}
                        />
                    )}
                    label="Error"
                />

                <br />

                <Button
                    onClick={resetValue}
                    id={`${customId}_resetValue`}
                >
                    Reset field
                </Button>
            </FormControl>
        </div>
    );
};

export default DisabledAndErrorDropdownExample;
