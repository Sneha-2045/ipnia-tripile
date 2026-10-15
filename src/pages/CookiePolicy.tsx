import { Link } from "react-router-dom";
import { Bullets, LegalPage, Paragraphs } from "@/components/legal/LegalPage";

const CookiePolicy = () => <LegalPage
  title="Cookie Policy"
  path="/cookie-policy"
  description="How Ipnia uses cookies, browser storage, and third-party services to support its website and travel features."
  sections={[
    {
      title: "1. Introduction",
      content: <Paragraphs children={[
        "Cookies are small files a website can save in your browser. Similar technologies include local storage and session storage, which let a website save information in your browser without creating a cookie. Pixels and embedded scripts can also make a browser contact another service. This policy describes the technologies found in Ipnia's current website code and how they support the features you choose to use.",
        <>This Cookie Policy applies to https://ipnia.com and should be read with our <Link className="underline" to="/privacy-policy">Privacy Policy</Link>. It describes the current implementation; if code or providers change, this page should be updated.</>,
      ]} />,
    },
    {
      title: "2. What Ipnia Stores or Loads",
      content: <><p>The current implementation uses the following first-party browser storage:</p><Bullets items={[
        "Cookie — `sidebar:state` remembers whether a dashboard sidebar is open or collapsed. The code sets it for seven days when the sidebar state changes.",
        "Local storage — `ipnia_auth_token` holds the account authentication token after sign-in. It is removed when you sign out or when the app clears an invalid token. The server-issued token expires according to configuration (the code default is seven days); local storage itself has no set expiry in the client code.",
        "Session storage — flight search and booking state (including passenger details and, for international routes, travel-document details), recent searches and hotel destinations, and the pending payment order reference are held for the browser tab's session. The code sets no separate time-to-live for these entries; clearing site data or ending the tab session generally removes them.",
      ]} /><p>These are different mechanisms: only `sidebar:state` is a cookie. The account token and search or booking entries are browser storage, not cookies. Do not use a shared device for sensitive travel details without clearing the browser session afterwards.</p>
        <p>The site loads Google Fonts for typography. It also has user-requested integrations described below. We did not find an analytics pixel, analytics SDK, advertising tag, or attribution SDK in the current source or production frontend configuration.</p>
      </>,
    },
    {
      title: "3. Types of Cookies and Similar Technologies",
      content: <><h3 className="font-bold text-amber-800">Strictly necessary and functional</h3><p>Account authentication, in-progress search and booking state, and the sidebar preference support features you choose to use. The sidebar cookie is a functional preference; the account and booking state use local or session storage. Cashfree is loaded when you start travel checkout, and the Google Maps embed is loaded only after you choose to load a map in hotel details.</p>
        <h3 className="font-bold text-amber-800">Analytics and performance</h3><p>We did not identify analytics or performance-measurement cookies, pixels, or SDKs in the current project. We therefore do not describe an analytics provider or analytics cookie as active.</p>
        <h3 className="font-bold text-amber-800">Advertising and attribution</h3><p>We did not identify advertising cookies, retargeting pixels, or attribution technologies in the current project. Ipnia does not currently offer controls for an advertising-cookie category because no such technology was found.</p>
        <p>Third-party services may use their own cookies or similar technologies when you choose to connect to them. Their specific cookie names, purposes, and retention periods are controlled by those providers and are not fully visible in Ipnia's code.</p>
      </>,
    },
    {
      title: "4. Why We Use These Technologies",
      content: <><p>First-party browser storage supports account sign-in, remembering an interface preference, and keeping your chosen flight search, hotel destination, passenger information, or pending payment reference available as you move through a booking flow. These entries are stored in your browser; flight and hotel searches and payment requests also send the relevant information to Ipnia's backend and the providers needed to answer the request.</p>
        <p>Security and transaction verification are handled by the website backend and payment provider. The client code does not show a separate fraud-prevention cookie or device fingerprinting product.</p>
        <p>Analytics, audience measurement, targeted advertising, and marketing pixels are not active in the project code inspected for this policy.</p>
      </>,
    },
    {
      title: "5. Third-Party Services",
      content: <><p>These providers are present in the current implementation:</p><ul className="list-disc space-y-2 pl-6">
        <li>Cashfree — its JavaScript checkout SDK is loaded when you choose to proceed with a travel payment. Cashfree hosts the payment experience and may use its own cookies or similar technologies. Read the <a href="https://www.cashfree.com/privacypolicy/" target="_blank" rel="noopener noreferrer" className="underline">Cashfree Privacy Policy</a>.</li>
        <li>Google Maps — an embedded map is available in hotel details. Ipnia waits for you to choose “I agree — load map from Google” before connecting the browser to the map embed. Google may receive technical connection information and the selected hotel's location. Read <a href="https://policies.google.com/privacy?hl=en-in" target="_blank" rel="noopener noreferrer" className="underline">Google's Privacy Policy</a>.</li>
        <li>Razorpay — a legacy course-payment page references the Razorpay checkout SDK, which is now requested only after the page receives a payment-order response. The source does not include a matching backend order route or a Razorpay key in the production frontend configuration, so we cannot verify that this is an active production payment feature. Read <a href="https://razorpay.com/privacy-policy/" target="_blank" rel="noopener noreferrer" className="underline">Razorpay's Privacy Policy</a>.</li>
        <li>Google Fonts — the site requests font files from Google Fonts to display its typography. This is a resource request, not an analytics or advertising integration. Google's Privacy Policy applies to Google's processing.</li>
      </ul><p>Flight offer search through Duffel, Google Places hotel search, and hotel-photo retrieval are called by Ipnia's backend; those server-to-server calls do not themselves place Duffel or Google Places cookies in your browser. Search details needed for a result are sent to the relevant provider. Social links are ordinary links; the social sites are not embedded as widgets in the pages inspected.</p>
        <p>Cashfree and Google operate independently and may change their technologies. Their privacy notices explain their practices; Ipnia does not control cookies set by their services.</p>
      </>,
    },
    {
      title: "6. Duration",
      content: <><p>The first-party sidebar cookie has a seven-day max age in the code. The account token stored in local storage has no client-side expiry; the backend JWT default expiry is seven days, but deployment configuration may change it. Signing out or clearing site storage removes the token from the browser.</p>
        <p>Session storage entries have no separate timer in the code and are associated with a browser tab session. Browser behavior such as restoring a previous session can affect when session data is cleared. Ipnia does not set a duration for cookies that a third-party provider may use; check that provider's current privacy and cookie information.</p>
      </>,
    },
    {
      title: "7. Choices and Consent",
      content: <><p>The current site does not have a cookie banner, consent-management platform, or central preferences panel. It also does not load analytics or advertising trackers that could be accepted, rejected, or customized through such a panel. There is no non-essential analytics or advertising category active in the implementation inspected.</p>
        <p>Cashfree checkout is requested when you choose to begin a payment. The hotel map is not loaded until you choose “I agree — load map from Google”; closing the hotel details without loading it keeps that map embed from being requested. The map choice applies only to that dialog and is cleared when it closes; it does not set a site-wide preference. Closing an already loaded map does not delete any data or cookies Google may have set; use browser controls or Google's own privacy settings to manage those.</p>
        <p>Where the law applicable to you requires prior consent for a particular third-party technology, that technology should not be loaded until the required consent is obtained. Ipnia does not currently provide a global setting to withdraw or revise a stored cookie-consent choice, because the site does not store such a choice. The business should assess this implementation against the locations it serves and add a consent manager before enabling any non-essential tracking or where law requires one.</p>
      </>,
    },
    {
      title: "8. Browser Controls",
      content: <Paragraphs children={[
        "You can use your browser or device settings to view, block, or clear cookies and site storage. You can remove the `sidebar:state` cookie, clear local storage to sign out, or clear session storage to remove current search and booking details. Browser controls differ by product and device; consult your browser's help information for instructions. Blocking or clearing essential storage can sign you out or interrupt a search, booking, or payment flow.",
      ]} />,
    },
    {
      title: "9. Privacy Requirements by Location",
      content: <Paragraphs children={[
        "Cookie and device-storage rules vary by location. In the EEA and UK, ePrivacy and data-protection rules may require prior consent for non-essential storage or access to information on a device; strictly necessary technologies may be treated differently. US state privacy laws can provide rights concerning sale, sharing, or targeted advertising in cases where those practices and laws apply. The project does not show targeted advertising or sale/sharing activity, but applicable rights depend on the user, the processing, and current law.",
        "Ipnia's site identifies an Indian business address and is primarily presented for Indian travelers. We have not verified all user locations or a complete market scope. This policy is not a determination that a particular country's law applies or that every implementation is compliant. The business should confirm its target markets and obtain legal review for any required consent or opt-out mechanisms.",
      ]} />,
    },
    {
      title: "10. Updates to This Policy",
      content: <Paragraphs children={[
        "We may update this page when browser storage, integrations, or legal requirements change. The latest revision date appears at the top. If we add analytics, advertising, or another non-essential technology, we will update the policy and implement any required notice and consent controls before using it where applicable.",
      ]} />,
    },
    {
      title: "11. Contact",
      content: <Paragraphs children={[
        <>For cookie or privacy questions, contact <a className="underline" href="mailto:Help@ipnia.com">Help@ipnia.com</a> or call <a className="underline" href="tel:+911145534440">+91 11 4553 4440</a>. The website is <a className="underline" href="https://ipnia.com">https://ipnia.com</a>. These details and the name “Ipnia Services Pvt Ltd” appear on the site; their status as registered particulars should be confirmed by the business owner.</>,
      ]} />,
    },
  ]}
/>

export default CookiePolicy;
