export const EMAIL_ADDRESS_REGEX = /^[\w-+.]+@([\w-]+\.)+[\w-]{2,4}$/;
export const ALPHA_ONLY_REGEX = /^[a-zA-Z ]{2,}$/;
export const ALPHA_NUMERIC_REGEX = /^[ A-Za-z0-9_@./#&+-:]{4,}$/;
export const NUMERIC_NUMBERS_REGEX = /^[0-9]/;
export const FLOAT_NUMERIC_NUMBERS_REGEX =
  /^[+-]?([0-9]+([.][0-9]*)?|[.][0-9]+)$/;
export const URLS_REGEX =
  /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/g;
export const GENERIC_PHONE_NUMBER_REGEX =
  /^(?:[0-9]{2,3}|\+[0-9]{2,3}|0)((?:7|1)[0-9]{8})$/;
