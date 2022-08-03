import React, { useState } from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import DoubleArrowIcon from '@material-ui/icons/DoubleArrow';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { useMutation } from '@apollo/react-hooks';
import { LOGIN_USER } from '../utils/mutations';
import Auth from '../utils/auth';

const useStyles = makeStyles((_theme) => ({
    container: {
        height: "100vh",
    },
    form: {
        maxWidth: 650,
        '@media (max-width:600px)': {
            width: 250,
            marginTop: '2rem',
            padding: 5,
        },
        '@media (min-width:1200px)': {
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            position: "absolute",
            maxWidth: 750,
        },
    },
    input: {
        color: "#003262",
        '@media (max-width:600px)': {
            fontSize: '1rem',
        },
    },
    button: {
        marginTop: "1rem",
        color: "#003262",
        borderColor: "grey",
    },
    field: {
        margin: "1rem 0rem",
    },

}));

const InputField = withStyles({
    root: {
        "& label.Mui-focused": {
            color: "grey",
        },
        "& label": {
            color: "#003262",
            '@media (max-width:600px)': {
                fontSize: '0.9rem',
            },
        },
        "& .MuiOutlinedInput-root": {
            "& fieldset": {
                borderColor: "grey",
            },
            "&:hover fieldset": {
                borderColor: "coffee",
            },
            "&.Mui-focused fieldset": {
                color: "whitesmoke",
                borderColor: "grey",
            },
        },
    },
})(TextField);

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const Login = (_props) => {

    const [open, setOpen] = useState(false);
    const [alertMsg, setAlertMsg] = useState('');
    const [severity, setSeverity] = useState('');
    const classes = useStyles();
    const [formState, setFormState] = useState({ email: '', password: '' });
    const [login, { error }] = useMutation(LOGIN_USER);

    // update state based on form input changes
    const handleChange = event => {
        const { name, value } = event.target;

        setFormState({
            ...formState,
            [name]: value
        });
    };

    // submit form
    const handleFormSubmit = async event => {
        event.preventDefault();

        try {
            const { data } = await login({
                variables: { ...formState }
            });

            Auth.login(data.login.token);
        } catch (error) {
            setOpen(true)
            setAlertMsg(error.text);
            setSeverity('error')
            console.error(error);
        }

        // clear form values
        setFormState({
            email: '',
            password: ''
        });
    };

    return (
        <Grid container justify="center">
            <Box component="form" className={classes.form} onSubmit={handleFormSubmit}>

                <InputField
                    fullWidth={true}
                    label="Email"
                    variant="outlined"
                    required
                    name='email'
                    type='email'
                    value={formState.email}
                    onChange={handleChange}
                    inputProps={{ className: classes.input }}
                    className={classes.field}
                />
                <InputField
                    fullWidth={true}
                    label="Password"
                    name='password'
                    required
                    variant="outlined"
                    value={formState.password}
                    onChange={handleChange}
                    inputProps={{ className: classes.input }}
                />
                <Button
                    variant="outlined"
                    fullWidth={true}
                    endIcon={<DoubleArrowIcon />}
                    type="submit"
                    className={classes.button}>
                    Login
                </Button>
            </Box>
            <Snackbar open={open} autoHideDuration={6000} onClose={() => setOpen(false)} className={classes.alertbox}>
                <Alert onClose={() => setOpen(false)} severity={severity} className={classes.alertbox}>
                    {error && alertMsg}
                </Alert>
            </Snackbar>
        </Grid>

    )
}

export default Login
