import * as React from 'react';
import {
    Typography,
    Box,
    Divider,
    FormControl,
    Input,
    Button,
    makeStyles,
    Theme,
    createStyles,
} from '@material-ui/core';
import LeftArrowIcon from 'Assets/icons/icons8-arrow-500.svg';
import MainButton from 'Components/Buttons/MainButton/MainButton';

/* STYLE */
const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        label: {
            color: theme.palette.primary.dark,
            alignItems: 'center',
            fontWeight: 700,
            textAlign: 'center',
        },
        divider: {
            marginBottom: '1rem',
            marginLeft: '22px',
            marginRight: '22px',
            height: '1px',
            backgroundColor: '#2A4B5B',
        },
        input: {
            border: '2px solid #2A4B5B',
            boxSizing: 'border-box',
            borderRadius: '12px',
            padding: '8px 20px',
        },
        flex: {
            display: 'flex',
            alignItems: 'center',
        },
    })
);

interface NameSetterProps {
    setName: (name: string) => void;
    readonly name: string;
    continue: () => void;
    back: () => void;
}

const NameSetter = (props: NameSetterProps) => {
    const classes = useStyles();
    const minLength = 1;
    const maxLength = 20;
    const [disabled, setDisabled] = React.useState<boolean>(true);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        const value = e.target.value;
        if (value.length >= minLength && value.length <= maxLength) {
            props.setName(value);
            setDisabled(false);
        } else if (value.length < minLength) {
            props.setName(value);
            setDisabled(true);
        }
    }

    return (
        <>
            <Button
                style={{ fontWeight: 600, textTransform: 'none', width: 'auto' }}
                onClick={() => props.back()}
            >
                <img src={LeftArrowIcon} style={{ marginRight: '7px', fontSize: '20px' }} /> Back
            </Button>
            <Typography component="span" gutterBottom>
                <Box fontSize="h6.fontSize" style={{ marginBottom: '40px', textAlign: 'center' }}>
                    Step 1 - Name
                </Box>
            </Typography>
            <Typography className={classes.label}>Name for the configuration</Typography>
            <Divider className={classes.divider} />
            <FormControl className={classes.flex}>
                <Input
                    onChange={(event) => handleChange(event)}
                    value={props.name}
                    type="text"
                    placeholder="Name for configuration"
                    className={classes.input}
                    disableUnderline={true}
                />
            </FormControl>
            <MainButton
                absolute={true}
                disabled={disabled}
                onClick={() => props.continue()}
            >
                Continue
            </MainButton>
        </>
    );
};

export default NameSetter;
