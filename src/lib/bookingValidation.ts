import type { Traveller } from "@/types/booking";

const NAME_RE = /^[A-Za-z][A-Za-z\s'.-]{0,49}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[6-9]\d{9}$/;

export type FieldErrors = Record<string, string>;

function isValidDate(value: string) {
  if (!value) return false;
  const d = new Date(value);
  return !Number.isNaN(d.getTime());
}

export function validateTravellerBasics(travellers: Traveller[]): FieldErrors {
  const errors: FieldErrors = {};

  travellers.forEach((t, i) => {
    const p = `t${i}`;
    if (!t.firstName.trim() || !NAME_RE.test(t.firstName.trim())) {
      errors[`${p}.firstName`] = "Enter a valid first name";
    }
    if (t.middleName.trim() && !NAME_RE.test(t.middleName.trim())) {
      errors[`${p}.middleName`] = "Enter a valid middle name";
    }
    if (!t.lastName.trim() || !NAME_RE.test(t.lastName.trim())) {
      errors[`${p}.lastName`] = "Enter a valid last name";
    }
    if (!isValidDate(t.dateOfBirth)) {
      errors[`${p}.dateOfBirth`] = "Enter a valid date of birth";
    } else {
      const dob = new Date(t.dateOfBirth);
      if (dob > new Date()) errors[`${p}.dateOfBirth`] = "Date of birth cannot be in the future";
    }
    if (!t.gender) errors[`${p}.gender`] = "Select gender";
    if (!t.nationality.trim()) errors[`${p}.nationality`] = "Nationality is required";
    if (!EMAIL_RE.test(t.email.trim())) errors[`${p}.email`] = "Enter a valid email";
    const phone = t.phone.replace(/\D/g, "").slice(-10);
    if (!PHONE_RE.test(phone)) errors[`${p}.phone`] = "Enter a valid 10-digit mobile number";
  });

  return errors;
}

export function validateTravelDocuments(
  travellers: Traveller[],
  travelDate: string,
  isInternational: boolean
): FieldErrors {
  if (!isInternational) return {};
  const errors: FieldErrors = {};
  const travel = travelDate ? new Date(travelDate) : null;

  travellers.forEach((t, i) => {
    const p = `t${i}`;
    const doc = t.document;
    if (!doc.passportNumber.trim() || doc.passportNumber.trim().length < 6) {
      errors[`${p}.passportNumber`] = "Enter a valid passport number";
    }
    if (!doc.issuingCountry.trim()) {
      errors[`${p}.issuingCountry`] = "Issuing country is required";
    }
    if (!doc.nationality.trim()) {
      errors[`${p}.docNationality`] = "Nationality is required";
    }
    if (!isValidDate(doc.expiryDate)) {
      errors[`${p}.expiryDate`] = "Enter a valid passport expiry date";
    } else if (travel && !Number.isNaN(travel.getTime()) && new Date(doc.expiryDate) <= travel) {
      errors[`${p}.expiryDate`] = "Passport must be valid after travel date";
    }
  });

  return errors;
}

export function travellerFullName(t: Traveller) {
  return [t.title, t.firstName, t.middleName, t.lastName].filter(Boolean).join(" ").replace(/\s+/g, " ").trim();
}

export function formatInr(amount: number) {
  return `₹${amount.toLocaleString("en-IN")}`;
}
