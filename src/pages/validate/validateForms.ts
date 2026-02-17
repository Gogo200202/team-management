import type { User } from "../../api/userTypes";

const defaultMessageEmail = "Not valid email";
const defaultMessagePassword = "Not valid password at least 4 characters";
export function emailValidation(value: string) {
  if (value.length == 0) {
    return true;
  }
  const regexEmail =
    /[-A-Za-z0-9!#$%&'*+\\/=?^_`{|}~]+(?:\.[-A-Za-z0-9!#$%&'*+\\/=?^_`{|}~]+)*@(?:[A-Za-z0-9](?:[-A-Za-z0-9]*[A-Za-z0-9])?\.)+[A-Za-z0-9](?:[-A-Za-z0-9]*[A-Za-z0-9])?/i;
  const isEmailValid = regexEmail.test(value);

  return isEmailValid || defaultMessageEmail;
}

export function passwordValidation(value: string) {
  if (value.length == 0) {
    return defaultMessagePassword;
  }

  const isPasswordValid = value.length >= 4;

  return isPasswordValid || defaultMessagePassword;
}

export function nameValidate(value: string) {
  if (value.length <= 3) {
    return "Name must have at least 4 characters";
  } else {
    return true;
  }
}

export function validateRegisterEmail(value: string, userdata: User[]) {
  if (value.length == 0) {
    return "Email required";
  }
  const resultFromEmailValidation = emailValidation(value);

  if (resultFromEmailValidation != "Not valid email") {
    const alreadyUsedEmail = userdata.find((x) => x.email == value);
    if (alreadyUsedEmail != null) {
      return "This email is already used";
    }
  } else {
    return resultFromEmailValidation;
  }
}

export function validateEditEmail(
  value: string,
  emailToSkip: string,
  userdata: User[],
) {
  if (value.length == 0) {
    return "Email required";
  }
  const resultFromEmailValidation = emailValidation(value);

  if (resultFromEmailValidation != "Not valid email") {
    const alreadyUsedEmail = userdata.find((x) => x.email == value);
    if (alreadyUsedEmail?.email == emailToSkip) {
      return;
    } else if (alreadyUsedEmail != null) {
      return "This email is already used";
    }
  } else {
    return resultFromEmailValidation;
  }
}
