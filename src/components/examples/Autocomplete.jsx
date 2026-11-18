import { useState } from 'react';
import { Autocomplete } from '@ellucian/react-design-system/core';

/**
 * Multiple Selection
 */
const AutocompleteMultipleSelectionExample = () => {
    const [value, setValue] = useState([]);

    const onChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <Autocomplete
            multiple
            id="multi-combo"
            label="Countries"
            options={SUGGESTIONS_SAMPLE_DATA}
            value={value}
            onChange={onChange}
        />
        //         <Autocomplete
        //     disabled
        //     error
        //     freeSolo
        //     fullWidth
        //     readOnly
        //     size="default"
        // />
    );
};

const SUGGESTIONS_SAMPLE_DATA = [
    { code: 'AD', label: 'Andorra' },
    { code: 'HN', label: 'Honduras' },
    { code: 'IE', label: 'Ireland' },
    { code: 'IN', label: 'India' },
    { code: 'MG', label: 'Madagascar' },
    { code: 'NZ', label: 'New Zealand' },
    { code: 'US', label: 'United States' },
];

export { AutocompleteMultipleSelectionExample };