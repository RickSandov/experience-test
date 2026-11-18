import { useState } from 'react';
import {
    Card,
    Grid,
    Typography,
    FormLabel,
    FormControlLabel,
    Radio,
    RadioGroup,
    makeStyles
} from '@ellucian/react-design-system/core';

const useStyles = makeStyles()((theme) => ({
    root: {
        flexGrow: 1,
    },
    card: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
}));

/**
 * Responsive Columns with Breakpoints
 */
function FullWidthGrid() {
    const { classes } = useStyles();
    const [spacing, setSpacing] = useState(2);

    const handleChange = (event) => {
        setSpacing(Number(event.target.value));
    };

    return (
        <div className={classes.root}>
            <Grid container spacing={spacing}>
                <Grid item xs={12}>
                    <Card className={classes.card}>
                        <Typography>xs=12</Typography>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Card className={classes.card}>
                        <Typography>xs=12 sm=6</Typography>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Card className={classes.card}>
                        <Typography>xs=12 sm=6</Typography>
                    </Card>
                </Grid>
                <Grid item xs={6} sm={2}>
                    <Card className={classes.card}>
                        <Typography>xs=6 sm=2</Typography>
                    </Card>
                </Grid>
                <Grid item xs={6} sm={2}>
                    <Card className={classes.card}>
                        <Typography>xs=6 sm=2</Typography>
                    </Card>
                </Grid>
                <Grid item xs={6} sm={2}>
                    <Card className={classes.card}>
                        <Typography>xs=6 sm=2</Typography>
                    </Card>
                </Grid>
                <Grid item xs={6} sm={2}>
                    <Card className={classes.card}>
                        <Typography>xs=6 sm=2</Typography>
                    </Card>
                </Grid>
                <Grid item xs={6} sm={2}>
                    <Card className={classes.card}>
                        <Typography>xs=6 sm=2</Typography>
                    </Card>
                </Grid>
                <Grid item xs={6} sm={2}>
                    <Card className={classes.card}>
                        <Typography>xs=6 sm=2</Typography>
                    </Card>
                </Grid>
            </Grid>
            <br />
            <br />
            <FormLabel>Spacing</FormLabel>
            <RadioGroup
                name="spacing"
                aria-label="Select a spacing value"
                value={spacing.toString()}
                onChange={handleChange}
                row
            >
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
                    <FormControlLabel
                        key={value}
                        value={value.toString()}
                        control={<Radio />}
                        label={value.toString()}
                    />
                ))}
            </RadioGroup>
        </div>
    );
}

export default FullWidthGrid;
