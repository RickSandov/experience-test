import { useState } from 'react';
import {
    Button,
    StepButton,
    StepProgress,
    StepLabel,
    Step,
    Typography,
    makeStyles
} from '@ellucian/react-design-system/core';
import { spacing500, spacing600 } from '@ellucian/react-design-system/core/styles/tokens';

const useStyles = makeStyles()(() => ({
    root: {
        width: '90%',
    },
    button: {
        marginRight: spacing500,
    },
    completed: {
        display: 'inline-block',
    },
    stepProgressContent: {
        marginTop: spacing500,
        marginBottom: spacing500,
    },
    stepProgressContentContainer: {
        padding: `0 ${spacing600} ${spacing600}`
    },
}));

const steps = [
    { label: 'Select campaign settings', content: 'Step 1: Select campaign settings...' },
    { label: 'Create an ad group', content: 'Step 2: What is an ad group anyways?' },
    { label: 'Create an ad', content: 'Step 3: This is the bit I really care about!' }
];

/**
 * Non-Linear
 */
const NonLinearExample = () => {
    const { classes } = useStyles();
    const [activeStep, setActiveStep] = useState(0);
    const [completed, setCompleted] = useState({});

    const completedSteps = () => Object.keys(completed).length;

    const isLastStep = () => activeStep === steps.length - 1;

    const allStepsCompleted = () => completedSteps() === steps.length;

    const handleNext = () => {
        let nextActiveStep;

        if (isLastStep() && !allStepsCompleted()) {
            // It's the last step, but not all steps have been completed,
            // find the first step that has been completed
            nextActiveStep = steps.findIndex((step, i) => !(i in completed));
        } else {
            nextActiveStep = activeStep + 1;
        }
        setActiveStep(nextActiveStep);
    };

    const handleBack = () => {
        setActiveStep(prevActiveStep => prevActiveStep - 1);
    };

    const handleStep = step => () => {
        setActiveStep(step);
    };

    const handleComplete = () => {
        setCompleted(prevCompleted => ({
            ...prevCompleted,
            [activeStep]: true,
        }));
        handleNext();
    };

    const handleReset = () => {
        setActiveStep(0);
        setCompleted({});
    };

    return (
        <div className={classes.root}>
            <Typography gutterBottom>
                <code>StepProgress</code> can also be non-linear. This means that steps can be completed in any order the user wishes. You can click or tab to the step you want to navigate to.
            </Typography>
            <StepProgress nonLinear activeStep={activeStep}>
                {steps.map((step, index) => {
                    return (
                        <Step completed={completed[index]} key={step.label}>
                            <StepButton
                                onClick={handleStep(index)}
                            >
                                <StepLabel>
                                    {step.label}
                                </StepLabel>
                            </StepButton>
                        </Step>
                    );
                })}
            </StepProgress>
            <div>
                {allStepsCompleted() ? (
                    <div className={classes.stepProgressContentContainer}>
                        <Typography className={classes.stepProgressContent}>
                            All steps completed - you&#39;re finished
                        </Typography>
                        <Button onClick={handleReset}>Reset</Button>
                    </div>
                ) : (
                    <div className={classes.stepProgressContentContainer}>
                        <Typography className={classes.stepProgressContent}>{steps[activeStep].content}</Typography>
                        <div>
                            <Button
                                color="secondary"
                                disabled={activeStep === 0}
                                onClick={handleBack}
                                className={classes.button}
                            >
                                Back
                            </Button>
                            <Button
                                color="primary"
                                onClick={handleNext}
                                className={classes.button}
                            >
                                Next
                            </Button>
                            {activeStep !== steps.length &&
                                (completed[activeStep] ? (
                                    <Typography variant="body2" className={classes.completed}>
                                        Step {activeStep + 1} already completed
                                    </Typography>
                                ) : (
                                    <Button color="primary" onClick={handleComplete}>
                                        {completedSteps() === steps.length - 1 ? 'Finish' : 'Complete step'}
                                    </Button>
                                ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NonLinearExample;
