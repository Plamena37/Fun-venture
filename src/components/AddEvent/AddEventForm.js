import { EventContext } from "../../context/EventsContextProvider";
import { useState, useContext } from "react";
import { v4 as uuidv4 } from "uuid";
import AddEventLayout from "./AddEventLayout";
import { validations } from "../validationMessages";
import {
  TextField,
  InputLabel,
  Select,
  MenuItem,
  FormControl,
  Box,
  Button,
} from "@material-ui/core";
import PublishIcon from "@material-ui/icons/Publish";
import { useNavigate } from "react-router-dom";
import "./AddEventForm.css";

export default function AddEventForm() {
  // Getting current date
  let currentDate = new Date();

  // Creating yyyy-mm-dd current date format
  let currentYear = currentDate.getFullYear().toString();
  let currentMonth = currentDate.getMonth() + 1;
  let currentDay = currentDate.getDate();

  if (currentMonth < 10) {
    currentMonth = `0${currentMonth}`;
  }
  if (currentDay < 10) {
    currentDay = `0${currentDay}`;
  }
  const currentDateFinal = `${currentYear}-${currentMonth}-${currentDay}`;

  //Get the notes data from the context by destructuring
  const { addToEventsData } = useContext(EventContext);

  // IMPORTANT
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    id: uuidv4(),
    title: "",
    description: "",
    price: 0,
    city: "",
    date: "",
    startTime: "",
    endTime: "",
    category: "",
    seats: 0,
    // image: "",
    team: "",
  });
  const [category, setCategory] = useState("");

  const [fieldErrors, setFieldErrors] = useState({
    title: false,
    description: false,
    price: false,
    city: false,
    startTime: false,
    seats: false,
    team: false,
  });

  const validationConditions = {
    title: /(^$)|(^[A-Za-z0-9 ]*[A-Za-z0-9][A-Za-z0-9 ]*$)/,
    description: /(^$)|(^.{10,500}$)/,
    price: /(^$)|(^[+]?\d+([.]\d+)?$)/,
    city: /(^$)|(^[a-zA-Z\s]*$)/,
    startTime: /(^$)|(^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$)/,
    seats: /(^$)|(^[+]?\d+([.]\d+)?$)/,
    team: /(^$)|(^[A-Za-z0-9 ]*[A-Za-z0-9][A-Za-z0-9 ]*$)/,
  };

  const handleValidation = (fieldName, fieldValue) => {
    if (
      fieldName !== "date" &&
      fieldName !== "endTime" &&
      fieldName !== "category"
    ) {
      setFieldErrors({
        ...fieldErrors,
        [fieldName]: !validationConditions[fieldName].test(fieldValue),
      });
    }
  };

  // EVENT HANDLE CHANGE
  const eventHandleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
    setCategory(value);
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
      //Sets the new note
      addToEventsData(formData);

      //Clear the form after submission.
      // setFormData({
      //   id: uuidv4(),
      //   title: "",
      //   description: "",
      //   price: 0,
      //   city: "",
      //   date: "",
      //   startTime: "",
      //   endTime: "",
      //   category: "",
      //   seats: 0,
      //   team: "",
      // });
      navigate("/added-event");
    }
  };

  // IMPORTANT

  return (
    <AddEventLayout children>
      <div className="add__events__header">
        <i class="fas fa-plus-circle events__icon"></i>
        <h2 className="form__primary__heading">Add New Event </h2>
      </div>
      <form className="add__event__form" onSubmit={handleSubmit}>
        {/************************ EVENT DESCRIPTION **********************************/}
        <section className="event__description">
          <nav className="form__nav">
            <i class="fas fa-info-circle form__icon"></i>
            <h3 className="form__heading">
              Event Desription <span>*</span>
            </h3>
          </nav>
          <div className="form__inputs">
            <TextField
              required
              className="form__input"
              id="title"
              name="title"
              value={formData.title}
              label="Event title"
              variant="outlined"
              onChange={(event) => eventHandleChange(event)}
              error={fieldErrors.title} //for letters and numbers
              helperText={fieldErrors.title && validations.title}
            />
            <TextField
              required
              className="form__input"
              id="description"
              name="description"
              value={formData.description}
              variant="outlined"
              label={`Event Description (char: ${formData.description.length})`}
              multiline
              minRows={4}
              maxRows={8}
              onChange={(event) => eventHandleChange(event)}
              error={fieldErrors.description} // all characters between 10 and 500
              helperText={fieldErrors.description && validations.description}
            />
            <TextField
              required
              className="form__input"
              id="price"
              name="price"
              value={formData.price}
              label="Ticket Price ($)"
              variant="outlined"
              type="number"
              onChange={(event) => eventHandleChange(event)}
              error={fieldErrors.price} // for positive numbers only
              helperText={fieldErrors.price && validations.positiveNumbersOnly}
            />
          </div>
        </section>

        {/************************ EVENT DETAILS **********************************/}
        <section className="event__details">
          <nav className="form__nav">
            <i class="fas fa-calendar-day form__icon"></i>
            <h3 className="form__heading">
              Event Details <span>*</span>
            </h3>
          </nav>
          <div className="form__inputs">
            <TextField
              required
              className="form__input"
              id="city"
              name="city"
              value={formData.city}
              label="City"
              variant="outlined"
              onChange={(event) => eventHandleChange(event)}
              error={fieldErrors.city} // will be true if the string contains numbers
              helperText={fieldErrors.city && validations.lettersOnly}
            />

            <TextField
              required
              className="form__input"
              InputLabelProps={{ shrink: true }}
              id="date"
              name="date"
              value={formData.date}
              label="Date"
              variant="outlined"
              type="date"
              onChange={(event) => eventHandleChange(event)}
              InputProps={{
                inputProps: { min: currentDateFinal },
              }}
              error={formData.date < currentDateFinal && formData.date !== ""}
              helperText={
                formData.date < currentDateFinal &&
                formData.date !== "" &&
                validations.date
              }
            />

            <div className="form__time">
              <TextField
                required
                className="form__input time"
                InputLabelProps={{ shrink: true }}
                id="startTime"
                name="startTime"
                value={formData.startTime}
                label="Start Time"
                variant="outlined"
                type="time"
                onChange={(event) => eventHandleChange(event)}
                error={fieldErrors.startTime} // will be true if the string contains numbers
                helperText={fieldErrors.startTime && validations.time}
              />

              <TextField
                required
                className="form__input time"
                InputLabelProps={{ shrink: true }}
                id="endTime"
                name="endTime"
                value={formData.endTime}
                label="End Time"
                variant="outlined"
                type="time"
                onChange={(event) => eventHandleChange(event)}
              />
            </div>
          </div>
        </section>

        {/************************ EVENT CATEGORY **********************************/}
        <section className="event__category">
          <nav className="form__nav">
            <i class="fas fa-chair form__icon"></i>
            <h3 className="form__heading">
              Event Category and Seats <span>*</span>
            </h3>
          </nav>
          <div className="form__inputs select__category">
            <div className="select">
              <Box sx={{ minWidth: 120 }}>
                <FormControl fullWidth>
                  <InputLabel
                    style={{ paddingLeft: "1rem" }}
                    id="demo-simple-select-label category__label"
                  >
                    Category
                  </InputLabel>
                  <Select
                    required
                    labelId="demo-simple-select-label"
                    id="category"
                    name="category"
                    value={category}
                    label="Category"
                    variant="outlined"
                    className="form__input select"
                    // onClick={handleChange}
                    onChange={(event) => eventHandleChange(event)}
                  >
                    <MenuItem value={"Festival"}>Festival</MenuItem>
                    <MenuItem value={"Concert"}>Concert</MenuItem>
                    <MenuItem value={"Outdoor"}>Outdoor</MenuItem>
                    <MenuItem value={"Theatre"}>Theatre</MenuItem>
                    <MenuItem value={"Sport Event"}>Sport Event</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </div>

            <TextField
              required
              className="form__input select"
              id="seats"
              name="seats"
              label="Total Seats"
              variant="outlined"
              type="number"
              onChange={(event) => eventHandleChange(event)}
              error={fieldErrors.seats} // for positive numbers only
              helperText={fieldErrors.seats && validations.positiveNumbersOnly}
            />
          </div>
        </section>

        {/************************ EVENT IMAGE **********************************/}
        <section className="event__image">
          <nav className="form__nav">
            <i class="fas fa-image form__icon"></i>
            <h3 className="form__heading">
              Event Image <span>*</span>
            </h3>
          </nav>
          <div>
            {/* <TextField
          required
          className="form__input"
          id="image"
          name="imagee"
          label="Image"
          variant="outlined"
           onChange={(event) => onChangeHandler(event)}
        /> */}
            <input type="file" style={{ display: "none" }} />
            <button className="event__img__btn">Upload Cover Image</button>
          </div>
        </section>

        {/************************ EVENT TEAM **********************************/}
        <section className="event__team">
          <nav className="form__nav">
            <i class="fas fa-user form__icon"></i>
            <h3 className="form__heading">
              Organizer Team <span>*</span>
            </h3>
          </nav>
          <div className="form__inputs">
            <TextField
              required
              name="team"
              id="team"
              className="form__input"
              label="Organizer Team"
              variant="outlined"
              onChange={(event) => eventHandleChange(event)}
              error={fieldErrors.team} //for letters and numbers
              helperText={fieldErrors.team && validations.title}
            />
          </div>
        </section>

        {/************************ EVENT BTN **********************************/}
        <Button
          style={{
            padding: "1.2rem 0.6rem",
            borderRadius: "0.3rem",
            width: "100%",
            fontSize: "1.2rem",
            fontWeight: 600,
            cursor: "pointer",
          }}
          variant="contained"
          startIcon={<PublishIcon />}
          color="primary"
          disabled={pushErrorsInArray()}
          type="submit"
        >
          Publish Event
        </Button>
      </form>
    </AddEventLayout>
  );
}
