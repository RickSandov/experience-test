import { useCallback, useMemo, useState } from 'react';
import {
    Chip,
    Typography,
    List,
    ListItem,
    ListItemText,
    makeStyles
} from '@ellucian/react-design-system/core';
import { spacing200 } from '@ellucian/react-design-system/core/styles/tokens';


const useStyles = makeStyles()(() => ({
    root: {
        padding: spacing200,
        '& $chip:first-child': {
            marginLeft: 0,
        },
        '& $chip:last-child': {
            marginRight: 0,
        },
    },
    chip: {
        margin: spacing200,
    },
    listContainer: {
        maxWidth: '30rem',
    },
}));

const SEMESTERS = [
    { label: 'Fall 2019', id: 'fall-2019' },
    { label: 'Spring 2020', id: 'spring-2020' },
    { label: 'Summer 2020', id: 'summer-2020' },
];

const courses = [
    { name: 'Child Psychology', semester: SEMESTERS[0].label, semesterKey: SEMESTERS[0].id, },
    { name: 'Internal Auditing', semester: SEMESTERS[1].label, semesterKey: SEMESTERS[1].id, },
    { name: 'Business Analytics', semester: SEMESTERS[0].label, semesterKey: SEMESTERS[0].id, },
    {
        name: 'Introduction to Fashion Accessory Design',
        semester: SEMESTERS[1].label, semesterKey: SEMESTERS[1].id,
    },
    { name: 'Math in Action', semester: SEMESTERS[2].label, semesterKey: SEMESTERS[2].id, },
];

/**
 * Filtering Courses with Chips
 */
const ListActivatedChips = () => {
    const customId = 'ChipActions';
    const { classes } = useStyles();
    const [chips, setChips] = useState([
        {
            id: 0,
            label: SEMESTERS[0].label,
            key: SEMESTERS[0].id,
            activated: false,
        },
        {
            id: 1,
            label: SEMESTERS[1].label,
            key: SEMESTERS[1].id,
            activated: false,
        },
        {
            id: 2,
            label: SEMESTERS[2].label,
            key: SEMESTERS[2].id,
            activated: false,
        },
    ]);

    const toggleChip = useCallback((id) => {
        setChips((prev) => prev.map((chip) => (
            chip.id === id ? { ...chip, activated: !chip.activated } : chip
        )));
    }, []);

    const filteredCourses = useMemo(() => {
        const activatedSemesterChips = chips
            .filter((chip) => chip.activated)
            .map((chip) => chip.key);

        if (activatedSemesterChips.length === 0) {
            return courses;
        }

        return courses.filter((course) => activatedSemesterChips.includes(course.semesterKey));
    }, [chips]);

    return (
        <div id={`${customId}_Container`}>
            <div className={classes.root}>
                <Typography paragraph>Filter courses:</Typography>
                {chips.map((chip) => (
                    <Chip
                        id={`${chip.key}_Chip`}
                        key={chip.key}
                        className={classes.chip}
                        label={chip.label}
                        onClick={() => toggleChip(chip.id)}
                        activated={chip.activated}
                    />
                ))}
            </div>
            <br />
            <List className={classes.listContainer}>
                {filteredCourses.map((course) => (
                    <ListItem key={`${course.name}_List_Item`}>
                        <ListItemText
                            primary={course.name}
                            secondary={course.semester}
                        />
                    </ListItem>
                ))}
            </List>
        </div>
    );


};


/**
 * Chip Group
 */
const ChipGroup = () => {
    const customId = 'Chip';
    const { classes } = useStyles();
    const [chipData, setChipData] = useState([
        { key: 0, label: 'Banner' },
        { key: 1, label: 'Training' },
        { key: 2, label: 'Financial Aid' },
        { key: 3, label: 'Student' },
        { key: 4, label: 'Mobile' },
        { key: 5, label: 'Cases' },
    ]);

    const handleDelete = useCallback((data) => () => {
        setChipData((prev) => prev.filter((chip) => chip !== data));
    }, []);

    return (
        <div id={`${customId}_Container`}>
            <Typography paragraph>
                <code>Chips</code> can be placed within a wrapping list and
                can also be removed from the list of chips.
            </Typography>
            <div className={classes.root} id={`${customId}_ChipContainer`} >
                {chipData.map((chip) => (
                    <Chip
                        id={`${chip.key}-chip`}
                        key={chip.key}
                        label={chip.label}
                        aria-label={`${chip.label} deletable`}
                        onDelete={handleDelete(chip)}
                        className={classes.chip}
                    />
                ))}
            </div>
        </div>
    );
};


export { ListActivatedChips, ChipGroup };
