import React, { useEffect, useState } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import networkingImg from "../assets/networking.jpg";
import { login, reset } from "../redux/slices/authSlice";
import Loader from "../utils/Loader";

const theme = createTheme();

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const loginResponse = useSelector((state) => state.auth.loginResponse);
  const loginError = useSelector((state) => state.auth.error);
  const loadingLoginResponse = useSelector((state) => state.auth.loading);

  const [errorMessage, setErrorMessage] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const loginData = {
      username: data.get("username"),
      password: data.get("password"),
    };

    dispatch(login(loginData));
  };

  useEffect(() => {
    if (loginResponse?.result) {
      console.log("asad", loginResponse?.result);
      localStorage.setItem("token", loginResponse?.result?.token);
      localStorage.setItem("userID", loginResponse?.result?.id);
      localStorage.setItem("username", loginResponse?.result?.username);
      dispatch(reset());
      navigate("/home");
    }
  }, [loginResponse]);

  useEffect(() => {
    if (loginError) setErrorMessage(true);
  }, []);

  useEffect(() => {
    const isLoggedin = localStorage.getItem("token");
    console.log({ localStorage });
    if (isLoggedin) {
      console.log({ isLoggedin });
      navigate("/home");
    }
  }, []);

  return (
    <ThemeProvider theme={theme}>
      {loadingLoginResponse ? (
        <Loader loading={loadingLoginResponse} />
      ) : (
        <>
          <Grid container component="main" sx={{ height: "100vh" }}>
            <CssBaseline />

            <Grid
              item
              xs={12}
              sm={8}
              md={5}
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
                <Avatar sx={{ m: 1, bgcolor: "#020612" }}>
                  <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                  Sign in
                </Typography>
                <Box
                  component="form"
                  noValidate
                  onSubmit={handleSubmit}
                  sx={{ mt: 1 }}
                >
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="username"
                    label="Username"
                    name="username"
                    autoFocus
                  />
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="current-password"
                  />

                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    style={{ backgroundColor: "#00489E" }}
                    sx={{ mt: 3, mb: 2 }}
                  >
                    Sign In
                  </Button>
                  <Grid container justifyContent="flex-end">
                    <Grid item>
                      <Link href="/signup" variant="body2">
                        {"Don't have an account? Sign Up"}
                      </Link>
                    </Grid>
                  </Grid>
                </Box>
              </Box>
            </Grid>
            <Grid
              item
              xs={false}
              sm={4}
              md={7}
              sx={{
                backgroundImage: "url(" + networkingImg + ")",
                backgroundRepeat: "no-repeat",
                backgroundColor: (t) =>
                  t.palette.mode === "light"
                    ? t.palette.grey[50]
                    : t.palette.grey[900],
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
          </Grid>
        </>
      )}
    </ThemeProvider>
  );
}
