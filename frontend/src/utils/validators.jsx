export function validateName(name) {
  if (!name || name.trim().length < 10) return "Name must be at least 20 characters.";
  if (name.trim().length > 60) return "Name must not exceed 60 characters.";
  return "";
}

export function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) return "Enter a valid email address.";
  return "";
}

export function validatePassword(password) {
  const passRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,16}$/;
  if (!password || !passRegex.test(password)) {
    return "Password must be 8-16 characters with at least one uppercase letter and one special character (!@#$%^&*).";
  }
  return "";
}

export function validateAddress(address) {
  if (!address || address.trim().length === 0) return "Address is required.";
  if (address.trim().length > 400) return "Address must not exceed 400 characters.";
  return "";
}
