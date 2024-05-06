import validator from "validator";

function check(value) {
  if (value === undefined || value === null) {
    return true;
  } else if (String(value).length < 1) {
    return true;
  } else if (validator.isEmpty(String(value))) {
    return true;
  } else return false;
}

const validate = (data) => {
  let errors = {};

  const { user_id, password } = data;

  if (check(user_id)) errors.user_id = "Id is required";

  if (check(password)) errors.password = "Password is required";

  return {
    isInvalid: Object.keys(errors).length > 0,
    error: errors,
  };
};

export { validate };
