export function validateName(full_name: string) {
  if (!full_name || typeof full_name !== "string") {
    return "Name is required.";
  }

  const trimmed = full_name.trim();

  if (trimmed.length < 4) {
    return "Name must be at least 4 characters.";
  }

  if (trimmed.replace(/\s+/g, "") === "") {
    return "Name cannot be empty or only spaces.";
  }

  return null;
}

export function validateEmail(email: string) {
  if (!email || typeof email !== "string") {
    return "Email is required.";
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    return "Invalid email format.";
  }

  return null;
}

export function validatePhone(phone: string) {
  if (!phone) return "Phone is required";
  if (!/^[0-9]{10,15}$/.test(phone)) return "Invalid phone number";
  return null;
}

export function validatePassword(password_hash: string) {
  if (!password_hash || typeof password_hash !== "string") {
    return "Password is required.";
  }

  const passwordRegex =
    /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;

  if (!passwordRegex.test(password_hash)) {
    return "Password must be at least 6 characters, include one uppercase letter, one number, and one special character.";
  }

  return null;
}

export function validateCountry(country: string) {
  if (!country || typeof country !== "string") {
    return "Please select a country.";
  }

  if (country.trim() === "") {
    return "Please select a valid country.";
  }

  return null;
}
