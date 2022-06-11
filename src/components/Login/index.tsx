import { FC, useState } from "react";
import { createStyles, makeStyles } from "@mui/styles";
import {
  Alert,
  Button,
  IconButton,
  InputAdornment,
  TextField,
  Theme,
} from "@mui/material";
import { useForm } from "react-hook-form";
import {
  PermIdentity,
  Visibility,
  VisibilityOff,
  LockOpen,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

import { EMAIL_ADDRESS_REGEX } from "../../utils/constants";
import Header from "../Header/Header";
import usePostRequest from "../../hooks/useRequest";
import { ErrorType } from "../../utils/types";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      height: "100vh",
      width: "100%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "flex-start",
      alignItems: "center",
      position: "relative",
    },

    section: {
      position: "absolute",
      top: "2vh",
      height: "95vh",
      flexGrow: 1,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },

    loginContainer: {
      width: "100%",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    form: {
      padding: theme.spacing(3),
      width: "380px",
      borderRadius: "5px",
      alignSelf: "center",
      margin: "auto",
      boxShadow: theme.shadows[3],
      backgroundColor: "#fff",
      fontFamily: "Roboto",
      borderBottom: "8px solid #D84465",
    },
    heading: {
      FontSize: "24px",
      textAlign: "left",
    },
    inputStyle: {
      margin: theme.spacing(2, 0),
      width: "100%",
      display: "flex",
      justifyContent: "flex-start",
      alignItems: "center",
      padding: "0.3em",
    },
    button: {
      width: "100%",
      backgroundColor: "#1A1D3F !important",
      color: "#fff",
      fontWeight: "bold",
      "&:hover": {
        backgroundColor: "#1A1D3F !important",
      },
      padding: theme.spacing(1.5, 0),
      margin: theme.spacing(2, 0),
    },
    footerLink: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      paddingTop: "15px",
      width: "fit-content",
      color: theme.palette.grey[800],
      textDecoration: "underline",
      "&:hover": {
        color: theme.palette.primary.main,
      },
    },
    helperText: {
      fontSize: "0.85rem",
      color: theme.palette.grey[600],
    },
  })
);

const Login: FC = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const [values, setValues] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState<false | ErrorType>(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({ defaultValues: values });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  const onSuccess = (res: any) => {
    sessionStorage.setItem("token", res.data.token);
    navigate("/dashboard");
  };

  const onFailure = (err: any) => {
    setError(err);
  };

  const mutation = usePostRequest(
    "/auth/login",
    { ...values },
    onSuccess,
    onFailure
  );

  const onSubmit = () => {
    mutation.reset();
    mutation.mutate();
  };

  return (
    <main className={classes.root}>
      <Header />
      <div className={classes.section}>
        <div className={classes.loginContainer}>
          <div className={classes.form}>
            {error && <Alert severity="error">{error.message}</Alert>}
            <form onSubmit={handleSubmit(onSubmit)}>
              <h3>Login</h3>

              <div className={classes.inputStyle}>
                <TextField
                  autoComplete="off"
                  style={{ flexGrow: 1 }}
                  id="input-with-icon-grid-email"
                  variant="outlined"
                  name="email"
                  label="Email address"
                  type="text"
                  color="secondary"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleChange(e)
                  }
                  inputRef={register({
                    required: "Email is required",
                    pattern: {
                      value: EMAIL_ADDRESS_REGEX,
                      message: "Use a valid email address",
                    },
                  })}
                  error={Boolean(errors?.email)}
                  helperText={errors?.email?.message}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PermIdentity />
                      </InputAdornment>
                    ),
                  }}
                />
              </div>

              <div className={classes.inputStyle}>
                <TextField
                  autoComplete="off"
                  style={{ flexGrow: 1 }}
                  id="input-with-icon-grid-password"
                  variant="outlined"
                  name="password"
                  label="Password"
                  color="secondary"
                  type={showPassword ? "text" : "password"}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleChange(e)
                  }
                  inputRef={register({
                    required: "Password is required",
                  })}
                  error={Boolean(errors?.password)}
                  helperText={errors?.password?.message}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockOpen />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          edge="end"
                        >
                          {showPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </div>

              <Button
                variant="contained"
                className={classes.button}
                color="secondary"
                type="submit"
                onClick={handleSubmit(onSubmit)}
                disabled={mutation.isLoading}
              >
                LOG IN
              </Button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Login;
