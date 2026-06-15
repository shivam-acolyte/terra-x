export const SITE_URL = "https://terraxopc.com";
export const SITE_NAME = "TERRA-X";
export const SITE_DESCRIPTION =
  "TERRA-X builds AI-powered autonomous excavators and robotic heavy machines for agriculture, construction, rescue, and defense.";

export function absoluteUrl(path = "/") {
  return new URL(path, SITE_URL).toString();
}
