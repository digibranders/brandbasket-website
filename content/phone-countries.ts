// content/phone-countries.ts
// The countries offered in the ad landing page's mobile number dropdown: India first (the page is for Indian ads), then the places
// Indians most often live in or call from, alphabetically. A number from anywhere else can still be typed with its +code.

export interface PhoneCountry {
  /** Two-letter country code, as the app's own sign-up uses it. */
  readonly iso: string;
  readonly name: string;
  /** What goes in front of the number, such as "+91". */
  readonly dial: string;
}

export const INDIA: PhoneCountry = { iso: "IN", name: "India", dial: "+91" };
export const UNITED_STATES: PhoneCountry = { iso: "US", name: "United States", dial: "+1" };

const OTHERS: readonly PhoneCountry[] = [
  { iso: "AU", name: "Australia", dial: "+61" },
  { iso: "BH", name: "Bahrain", dial: "+973" },
  { iso: "BD", name: "Bangladesh", dial: "+880" },
  { iso: "CA", name: "Canada", dial: "+1" },
  { iso: "CN", name: "China", dial: "+86" },
  { iso: "FR", name: "France", dial: "+33" },
  { iso: "DE", name: "Germany", dial: "+49" },
  { iso: "HK", name: "Hong Kong", dial: "+852" },
  { iso: "ID", name: "Indonesia", dial: "+62" },
  { iso: "IE", name: "Ireland", dial: "+353" },
  { iso: "IT", name: "Italy", dial: "+39" },
  { iso: "JP", name: "Japan", dial: "+81" },
  { iso: "KE", name: "Kenya", dial: "+254" },
  { iso: "KW", name: "Kuwait", dial: "+965" },
  { iso: "MY", name: "Malaysia", dial: "+60" },
  { iso: "NP", name: "Nepal", dial: "+977" },
  { iso: "NL", name: "Netherlands", dial: "+31" },
  { iso: "NZ", name: "New Zealand", dial: "+64" },
  { iso: "NG", name: "Nigeria", dial: "+234" },
  { iso: "OM", name: "Oman", dial: "+968" },
  { iso: "PK", name: "Pakistan", dial: "+92" },
  { iso: "PH", name: "Philippines", dial: "+63" },
  { iso: "QA", name: "Qatar", dial: "+974" },
  { iso: "SA", name: "Saudi Arabia", dial: "+966" },
  { iso: "SG", name: "Singapore", dial: "+65" },
  { iso: "ZA", name: "South Africa", dial: "+27" },
  { iso: "KR", name: "South Korea", dial: "+82" },
  { iso: "ES", name: "Spain", dial: "+34" },
  { iso: "LK", name: "Sri Lanka", dial: "+94" },
  { iso: "TH", name: "Thailand", dial: "+66" },
  { iso: "AE", name: "United Arab Emirates", dial: "+971" },
  { iso: "GB", name: "United Kingdom", dial: "+44" },
];

export const PHONE_COUNTRIES: readonly PhoneCountry[] = [INDIA, ...OTHERS, UNITED_STATES].sort((a, b) => (a === INDIA ? -1 : b === INDIA ? 1 : a.name.localeCompare(b.name)));

export function countryByIso(iso: string): PhoneCountry | undefined {
  return PHONE_COUNTRIES.find((country) => country.iso === iso);
}

/** The country in a browser language such as "en-GB" or "en-AE", when it is one of the listed ones. */
export function countryFromLocale(locale: string): PhoneCountry | undefined {
  const region = /^[a-z]{2,3}[-_]([A-Za-z]{2})\b/.exec(locale)?.[1]?.toUpperCase();
  return region === undefined ? undefined : countryByIso(region);
}
