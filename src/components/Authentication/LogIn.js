import { useState } from "react";
import { TextField, Button } from "@material-ui/core";
import { Link, useNavigate } from "react-router-dom";
import { validations } from "../validationMessages";
import "./AuthForm.css";
import "../../Variables.css";

export default function LogInForm() {
  const navigate = useNavigate();

  const [logInFieldsState, setLogInFieldsState] = useState({
    email: "",
    password: "",
  });

  const [fieldErrors, setFieldErrors] = useState({
    email: false,
    password: false,
  });

  const validationConditions = {
    email: /(^$)|(^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$)/,
    password: /(^$)|(^.{5,}$)/,
  };

  const handleValidation = (fieldName, fieldValue) => {
    if (fieldName !== "confirmPassword") {
      setFieldErrors({
        ...fieldErrors,
        [fieldName]: !validationConditions[fieldName].test(fieldValue),
      });
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    //Set the state
    setLogInFieldsState({
      ...logInFieldsState,
      [name]: value,
    });
    handleValidation(name, value);
  };

  // PUSHES THE ERROR BOOLEANS IN AN ARRAY
  const pushErrorsInArray = () => {
    let arrayWithValues = [];
    for (const errorValue in fieldErrors) {
      arrayWithValues.push(fieldErrors[errorValue]);
    }
    // IF THE ARRAY CONTAINS A FALSY VALUE, THE OPERATION STOPS AND RETURNS FALSE
    return arrayWithValues.some((element) => element === true);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    let checkForErrors = pushErrorsInArray();

    if (!checkForErrors) {
      // TODO FIXME
      let emailLocalStorage = localStorage.getItem("email").replace(/"/g, "");
      let passwordLocalStorage = localStorage
        .getItem("password")
        .replace(/"/g, "");

      if (
        logInFieldsState.email === emailLocalStorage &&
        logInFieldsState.password === passwordLocalStorage
      ) {
        navigate("/");
        console.log("LOGIN COMPLETED 🎉🎉🎉");
      }

      // TODO FIXME
    }
  };

  return (
    <div className="form form--signup">
      <nav className="login__nav">
        <button className="form__btn btn--active">Login</button>
        <span className="form__span">|</span>
        <Link to="/signup" className="router__link logo">
          <button className="form__btn ">Sign up</button>
        </Link>
      </nav>
      <form onSubmit={handleSubmit}>
        <TextField
          id="email"
          name="email"
          label="Email"
          onChange={handleChange}
          value={logInFieldsState.email}
          required
          className="textfield"
          variant="standard"
          error={fieldErrors.email}
          helperText={fieldErrors.email && validations.email}
        />
        <TextField
          id="password"
          name="password"
          label="Password"
          onChange={handleChange}
          value={logInFieldsState.password}
          required
          className="textfield"
          type="password"
          autoComplete="current-password"
          error={fieldErrors.password} // for more than 5 characters
          helperText={fieldErrors.password && validations.password}
        />

        <Button
          style={{
            margin: "2rem 0 1rem",
            padding: "0.75rem 0.6rem",
            borderRadius: "0.3rem",
            width: "100%",
            fontSize: "1.2rem",
            fontWeight: 600,
            cursor: "pointer",
          }}
          variant="contained"
          color="primary"
          disabled={pushErrorsInArray()}
          type="submit"
        >
          Log in
        </Button>

        <button className="btn btn--secondary">Sign in with google</button>
      </form>
    </div>
  );
}
