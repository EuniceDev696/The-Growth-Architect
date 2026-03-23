import current from "../assets/images/logo-wordmark.svg";
import premium from "../assets/images/logo-wordmark-premium.svg";
import minimal from "../assets/images/logo-wordmark-minimal.svg";
import bold from "../assets/images/logo-wordmark-bold.svg";

export const LOGO_VARIANTS = {
  current,
  premium,
  minimal,
  bold,
};

// Change this key to switch logo globally: current | premium | minimal | bold
export const ACTIVE_LOGO_KEY = "minimal";

export const ACTIVE_LOGO = LOGO_VARIANTS[ACTIVE_LOGO_KEY] || LOGO_VARIANTS.bold;
