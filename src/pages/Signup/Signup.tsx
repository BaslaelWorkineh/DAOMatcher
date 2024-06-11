/* eslint-disable @typescript-eslint/no-explicit-any */
// Install Material-UI if not already installed
// npm install @mui/material @emotion/react @emotion/styled

import { useState, CSSProperties } from "react";
import {
  TextField,
  Typography,
  Container,
  CssBaseline,
  Avatar,
  FormHelperText,
  InputAdornment,
  IconButton,
  Alert,
} from "@mui/material";
import {
  validateEmail,
  validatePassword,
  confirmPassword,
  validateName,
} from "@/utils/validators";
import { Visibility, VisibilityOff } from "@mui/icons-material";

import axios, { AxiosError, AxiosResponse } from "axios";
import { BASE_URL } from "@/config/default";
import AuthResponse from "@/types/AuthTypes";
import { addUser } from "@/redux/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { selectAllHomeStates, setIsLoggedIn } from "@/pages/Home/homeSlice";
import OptionLink from "@/components/ui/OptionLink";
import Button from "@/components/ui/Button";
import { Navigate } from "react-router-dom";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  email: string;
  given_name: string;
  [key: string]: any;
}

const styles = {
  paper: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  } as CSSProperties,
  avatar: {
    margin: "8px",
    backgroundColor: "secondary",
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: "8px",
  },
  submit: {
    margin: "24px 0 16px",
  },
};

const SignupPage = () => {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState("");
  const [password, setPassword] = useState("");
  const [confirmedPassword, setCOnfirmedPassword] = useState("");
  const [passError, setPassError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const dispatch = useDispatch();
  const isLoggedIn = useSelector(selectAllHomeStates).isLoggedIn;

  if (isLoggedIn) {
    return <Navigate to="/DAOMatcher/verifyEmail" replace />;
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSignup = async (e: any) => {
    e.preventDefault();

    if (!validateName(name, setNameError)) {
      console.log("Name is invalid : ", name);
      return;
    }

    if (!validateEmail(email, setEmailError)) {
      console.log("Email is invalid : ", email);
      return;
    }

    if (!validatePassword(password, setPassError)) {
      console.log("Password is invalid: ", email);
      return;
    }

    if (!confirmPassword(password, confirmedPassword, setPassError)) {
      console.log("Password do not match: ", email);
      return;
    }

    console.log(`Email: ${email} Password: ${password}`);

    let data: AuthResponse;
    try {
      setIsLoading(true);

      const { data: successData }: AxiosResponse<AuthResponse> =
        await axios.post(
          `${BASE_URL}/api/auth/register`,
          {
            display_name: name,
            email,
            password,
          },
          { withCredentials: true }
        );
      data = successData;
    } catch (error) {
      if (error instanceof AxiosError) {
        const errorData: AuthResponse = error
          ? error.response
            ? error.response.data
              ? error.response.data
              : null
            : null
          : null;
        data = errorData
          ? errorData
          : {
              success: false,
              data: null,
              error: "Signup Failed due to server error",
              message: null,
            };
      } else {
        data = {
          success: false,
          data: null,
          error: "Something went wrong with your signup",
          message: null,
        };
      }
      setIsLoading(false);
    }

    const { success, message, error, data: loginData } = data;
    setSuccess(success);

    if (!success) {
      return setError(message ?? error ?? "Something went wrong");
    } else {
      setEmail("");
      setPassword("");
      setSuccessMessage(message ?? "Signup Successful");
      setError("");
      dispatch(addUser(loginData));
      dispatch(setIsLoggedIn(true));

      return <Navigate to="/DAOMatcher" replace />;
    }
  };

  const googleAuthSuccessHandler = (credentialResponse: CredentialResponse) => {
    const decoded: DecodedToken = jwtDecode(
      credentialResponse?.credential ?? ""
    );
    let email = decoded.email;
    let name = decoded.name;
    console.log("Decoded JWT:", decoded);
    console.log("Email:", email);
    console.log("Name:", name);

    // Prepare data to send to backend
    const data = {
      name,
      email,
    };

    // Send data to backend
    fetch(`${BASE_URL}/api/auth/google-signin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
        // Handle successful login, maybe redirect the user or show a message
      })
      .catch((error) => {
        console.error("Error:", error);
        // Handle errors
      });
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div style={styles.paper}>
        <Avatar style={styles.avatar} src="vite.svg" />
        <Typography component="h1" variant="h5">
          Sign Up
        </Typography>
        <form
          style={styles.form}
          noValidate
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              handleSignup(event);
            }
          }}
        >
          {error ? <Alert severity="error">{error}</Alert> : null}
          {success && successMessage ? (
            <Alert severity="success">{successMessage}</Alert>
          ) : null}
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="name"
            label="Name"
            name="name"
            type="name"
            autoComplete="name"
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={() => validateName(name, setNameError)}
          />

          <FormHelperText error>{nameError}</FormHelperText>

          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => validateEmail(email, setEmailError)}
          />
          <FormHelperText error>{emailError}</FormHelperText>

          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type={showPassword ? "text" : "password"}
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onBlur={() => validatePassword(password, setPassError)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={togglePasswordVisibility} edge="end">
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <FormHelperText error>{passError}</FormHelperText>

          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Confirm Password"
            type={showPassword ? "text" : "password"}
            id="confirmPassword"
            // autoComplete="current-password"
            value={confirmedPassword}
            onChange={(e) => setCOnfirmedPassword(e.target.value)}
            onBlur={() =>
              confirmPassword(password, confirmedPassword, setPassError)
            }
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={togglePasswordVisibility} edge="end">
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <FormHelperText error>{passError}</FormHelperText>

          <Button text="Sign Up" loading={isLoading} onClick={handleSignup} />

          <OptionLink
            text="Already have an account? Login"
            to="/DAOMatcher/login"
          />
        </form>

        <GoogleLogin
          onSuccess={(credentialResponse) =>
            googleAuthSuccessHandler(credentialResponse)
          }
          onError={() => {
            console.log("Login Failed");
            setError("Google Authentication Failed");
          }}
        />
      </div>
    </Container>
  );
};

export default SignupPage;
