import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Snackbar from "@mui/material/Snackbar";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { AuthContext } from "../contexts/AuthContext";

const defaultTheme = createTheme();

export default function Authentication() {

    const { handleRegister, handleLogin } = React.useContext(AuthContext);
    const [username, setUsername] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [name, setName] = React.useState("");
    const [error, setError] = React.useState("");
    const [message, setMessage] = React.useState("");

    const [formState, setFormState] = React.useState(0);
    const [open, setOpen] = React.useState(false);

    let handleAuth = async () => {
        try {
            if (formState === 0) {
                let result = await handleLogin(username, password)
            }
            if (formState === 1) {

                if (password.length < 12) {
                    setError("Password must be at least 12 characters long");
                    return;
                }
                let result = await handleRegister(name, username, password);
                console.log(result);
                setUsername("");
                setMessage(result);
                setOpen(true);
                setError("")
                setFormState(0)
                setPassword("")
            }
        } catch (err) {
            console.log(err);
            let message = err?.response?.data?.message || "Something went wrong. Please try again.";
            setError(message);
        }
    }


    return (
        <ThemeProvider theme={defaultTheme}>
            <Grid
                container
                component="main"
                sx={{
                    height: "100vh",
                    width: "100vw",
                }}
            >
                <CssBaseline />

                {/* LEFT SIDE - BACKGROUND IMAGE */}
                <Grid
                    size={{ xs: 0, sm: 4, md: 7 }}
                    sx={{
                        display: {
                            xs: "none",
                            sm: "block",
                        },
                        backgroundImage:
                            'url("https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80")',
                        backgroundRepeat: "no-repeat",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                    }}
                />

                {/* RIGHT SIDE - FORM */}
                <Grid
                    size={{ xs: 12, sm: 8, md: 5 }}
                    component={Paper}
                    elevation={6}
                    square
                >
                    <Box
                        sx={{
                            my: 8,
                            mx: 4,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                        }}
                    >
                        {/* LOCK ICON */}
                        <Avatar
                            sx={{
                                m: 1,
                                bgcolor: "secondary.main",
                            }}
                        >
                            <LockOutlinedIcon />
                        </Avatar>

                        {/* SIGN IN / SIGN UP BUTTONS */}
                        <Box>
                            <Button
                                variant={formState === 0 ? "contained" : "text"} onClick={() => setFormState(0)}
                            >
                                Sign In
                            </Button>

                            <Button
                                variant={ formState === 1 ? "contained" : "text" } onClick={() => setFormState(1)}
                            >
                                Sign Up
                            </Button>
                        </Box>

                        {/* FORM */}
                        <Box
                            component="form"
                            noValidate
                            sx={{
                                mt: 1,
                                width: "100%",
                            }}
                        >
                            {/* FULL NAME - ONLY FOR SIGN UP */}
                            {formState === 1 && (
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="name"
                                    label="Full Name"
                                    name="name"
                                    value={name}
                                    autoFocus
                                    onChange={(e) =>
                                        setName(e.target.value)
                                    }
                                />
                            )}

                            {/* USERNAME */}
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="username"
                                label="Username"
                                name="username"
                                value={username}
                                autoFocus={formState === 0}
                                onChange={(e) =>
                                    setUsername(e.target.value)
                                }
                            />

                            {/* PASSWORD */}
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) =>
                                    setPassword(e.target.value)
                                }
                            />

                            {/* ERROR */}
                            <Box
                                component="p"
                                sx={{
                                    color: "error.main",
                                    width: "100%",
                                    minHeight: "24px",
                                    mb: 0,
                                }}
                            >
                                {error}
                            </Box>

                            {/* LOGIN / REGISTER BUTTON */}
                            <Button
                                type="button"
                                fullWidth
                                variant="contained"
                                sx={{
                                    mt: 3,
                                    mb: 2,
                                }}
                                onClick={handleAuth}
                            >
                                {formState === 0 ? "Login" : "Register"}
                            </Button>
                        </Box>
                    </Box>
                </Grid>
            </Grid>

            {/* SNACKBAR */}
            <Snackbar
                open={open}
                autoHideDuration={4000}
                message={message}
                onClose={() => setOpen(false)}
            />
        </ThemeProvider>
    );
}