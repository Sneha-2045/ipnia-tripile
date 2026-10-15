import { Link } from "react-router-dom";
import { Bullets, LegalPage, Paragraphs } from "@/components/legal/LegalPage";

const PrivacyPolicy = () => <LegalPage
  title="Privacy Policy"
  path="/privacy-policy"
  description="Learn how Ipnia handles personal information in its travel search, booking, payment, account, and support services."
  sections={[
    {
      title: "Introduction",
      content: <Paragraphs children={[
        <>This Privacy Policy explains how Ipnia Services Pvt Ltd ("Ipnia," "we," "our," or "us") handles personal information when you visit <a className="underline" href="https://ipnia.com">ipnia.com</a>, search for travel, use an account, submit a booking or payment request, contact us, or otherwise use our website and related services (the "Services"). It describes the information we collect, why we use it, when we share it, and the choices and rights that may be available to you.</>,
        "This policy applies to information handled through Ipnia's website and the connected services described below. Independent suppliers and service providers may separately process information under their own privacy notices. We may update this page when our Services or data practices change; the revision date appears above.",
      ]} />,
    },
    {
      title: "1. Children and Travel Companions",
      content: <Paragraphs children={[
        "Ipnia accounts and website services are intended for people who can use them under the laws that apply to them. We do not knowingly invite children to create accounts independently where parental or guardian involvement is required by law.",
        "Children may be included as passengers or guests in a travel request. A parent, guardian, or other adult authorized to arrange the trip may submit a child's name, date of birth, and other details when a supplier requires them. That adult is responsible for having authority to provide the information. If you believe a child submitted information without appropriate authorization, contact us using the details below so we can review the request and take steps required by law.",
      ]} />,
    },
    {
      title: "2. Information We Collect and How We Collect It",
      content: <><p>The information depends on which features you use. It may include:</p>
        <h3 className="font-bold text-amber-800">Information you submit</h3>
        <Bullets items={[
          "Contact and account details such as your name, email address, phone number, login credentials, and account preferences. When you create an account, the server stores a password verifier rather than the password in readable form; the account system also records sign-in and account activity details.",
          "Travel search and itinerary information, including origin, destination, travel dates, passenger or guest counts, cabin or room preferences, hotel destination, check-in and check-out dates, and recent searches stored during your browser session.",
          "Passenger and guest details needed for a travel request, such as names, contact information, date of birth, nationality, or passport and other travel-document details where the workflow or relevant supplier requires them. Do not submit travel-document information unless requested in the applicable flow.",
          "Payment and transaction information, including order references, payment status, amount, currency, and customer details used to initiate or investigate a transaction. Cashfree hosted checkout handles payment credentials; Ipnia's application records do not include full card numbers.",
          "Messages, booking references, and other information you choose to provide in support or contact requests.",
        ]} />
        <h3 className="font-bold text-amber-800">Information collected through the website</h3>
        <p>When you use the Services, our application and infrastructure may process technical details such as IP address, browser and device type, operating system, pages and features used, referral information, timestamps, error events, and security or performance logs. We do not use these details to claim a precise location; approximate location may sometimes be inferred from an IP address by service providers.</p>
        <h3 className="font-bold text-amber-800">Information from service providers</h3>
        <p>We receive information from providers used to operate a feature, such as flight offer details from Duffel, hotel place and listing information from Google Places, and payment status and order references from Cashfree. We may receive account, payment, supplier, or reservation status information necessary to support a request. Providers' own notices explain their independent processing.</p>
      </>,
    },
    {
      title: "3. Information You Provide Through Ipnia Features",
      content: <><p>You may provide information through flight and hotel search forms, passenger and travel-document steps, booking review and checkout, account registration and sign-in, and support requests. We use these details to return relevant search results, prepare a travel or payment request, communicate about its status, and respond to you. Where needed, booking details may be sent to a travel supplier or booking provider so it can verify an offer or fulfil a travel service.</p>
        <p>The footer's newsletter field does not directly subscribe you to an automated mailing list. Submitting it opens a prefilled email addressed to Help@ipnia.com; your email application must send that message. It is a request to Ipnia, not an automated subscription or proof that promotional consent has been recorded. There is no SMS or text-message subscription feature in the current website.</p>
      </>,
    },
    {
      title: "4. Cookies, Local Storage, and Automatic Collection",
      content: <><p>The current site uses browser storage for essential functionality. Session storage can hold search, booking, and pending-payment state during a visit; local storage can hold an account authentication token; and a cookie may remember a site-interface preference. These technologies support search and checkout continuity, account state, and site usability.</p>
        <p>We did not find an analytics or advertising pixel integration in the current project code. This policy does not claim that Ipnia currently uses Google Analytics, Meta Pixel, Hotjar, or another analytics or advertising vendor. If optional tracking is introduced, Ipnia should update this notice and provide any consent controls required by law before activating it.</p>
        <p>You can clear or restrict cookies and browser storage through your browser or device settings. The current site does not provide a separate cookie-preference panel. Restricting essential storage may disrupt sign-in, travel searches, or an in-progress booking. See the <Link className="underline" to="/cookie-policy">Cookie Policy</Link>.</p>
      </>,
    },
    {
      title: "5. Third-Party Services and Tracking",
      content: <><p>Some features connect to independent services. Duffel supplies flight search offers; Google Places supplies hotel search and place information; Cashfree provides hosted payment checkout and transaction status. The site also uses database and hosting infrastructure to operate accounts, searches, and payment records. The code identifies MongoDB Atlas as the database service; the precise hosting region and any additional infrastructure providers should be confirmed by the operator.</p>
        <p>When a browser connects to a third-party service or you open a third-party site, that provider may receive technical or transaction information under its own privacy terms. Ipnia does not control independent services' data practices outside our instructions and control. Review the provider's notice before submitting information directly to it. The project does not show third-party advertising cookies or analytics trackers.</p>
      </>,
    },
    {
      title: "6. How We Use Information",
      content: <><p>We use information for purposes connected to the features you choose, including to:</p><Bullets items={[
        "Display flight and hotel search results, compare travel options, and retain in-session search or booking state.",
        "Retrieve and verify flight-offer details, create payment orders, check payment status, and investigate failed, pending, or disputed transactions.",
        "Handle hotel enquiries and deposits. Hotel-only checkout collects a booking confirmation deposit; Ipnia then confirms availability and the final stay amount. A hotel selected with a flight is arranged with Ipnia after flight payment confirmation. A search or payment alone is not supplier confirmation.",
        "Administer accounts and authentication, respond to support requests, and communicate necessary payment, booking, security, or service information.",
        "Prevent fraud, unauthorized activity, and misuse; protect the Services; troubleshoot errors; and maintain or improve reliability and usability.",
        "Send promotional communications only where permitted and based on an appropriate choice or consent where required. The current footer form initiates a user-directed email request; it does not operate an automated marketing list.",
        "Meet applicable legal, tax, accounting, regulatory, contractual, recordkeeping, and dispute-resolution requirements, and establish or defend legal claims.",
      ]} /><p>Service messages needed to process a request are distinct from optional promotional communications.</p></>,
    },
    {
      title: "7. How We Share Information",
      content: <><p>We disclose only information relevant to the purpose, as reasonably necessary and permitted by law, to categories such as:</p><Bullets items={[
        "Flight providers and travel suppliers, including Duffel and relevant airlines or reservation providers, when needed to display, verify, or fulfil a travel request.",
        "Google Places for hotel search, place details, and lodging information; the search results do not by themselves confirm a hotel reservation.",
        "Cashfree for hosted checkout, payment processing, transaction verification, and payment-status updates.",
        "Database, hosting, infrastructure, security, and technical providers that store or operate parts of the Services. The project uses MongoDB Atlas; further vendor and region details require operator confirmation.",
        "Our professional advisers, insurers, auditors, and service providers acting for us, subject to appropriate duties and applicable law.",
        "Courts, regulators, law-enforcement bodies, or other authorities when disclosure is required or reasonably necessary to comply with law, protect rights and safety, investigate fraud, or respond to a valid legal process.",
        "A successor or acquiring organization in a legitimate merger, restructuring, financing, or transfer of some or all of the relevant business, subject to appropriate confidentiality and legal protections.",
      ]} /><p>The current project does not show an analytics or advertising provider receiving data. We do not sell personal information in the ordinary sense of exchanging customer records for money. If a future practice is treated as a sale, sharing, or targeted advertising under a law that applies, Ipnia must provide the required notice and opt-out controls before relying on that practice.</p></>,
    },
    {
      title: "8. Email, Newsletter, SMS, and Promotional Messages",
      content: <Paragraphs children={[
        "The website currently has no automated newsletter or SMS delivery system. The footer form opens a preaddressed email to Help@ipnia.com, and a user must send that email through their own mail application. Ipnia may use a request received this way to respond or, if separately and lawfully arranged, to manage a requested subscription. Submitting the form alone does not add an address to a mailing list.",
        "We do not describe promotional SMS, text, or messaging alerts as available. If Ipnia later sends promotional email, each message should provide a working opt-out method and we will honor applicable preferences. Essential service communications about an account, booking, payment, security, or support may still be sent when needed, even if you opt out of marketing. Marketing consent is not a condition of a travel purchase unless the law permits it and the service genuinely requires it.",
      ]} />,
    },
    {
      title: "9. Your Choices and Privacy Rights",
      content: <><p>Depending on where you live and which privacy laws apply, you may be able to request access to personal information, correction of inaccurate details, deletion of eligible information, a portable copy, restriction of or objection to certain processing, or withdrawal of consent where consent is the basis for processing. You may also have a right to complain to a privacy regulator.</p>
        <p>Where applicable law gives you additional rights, such as rights concerning targeted advertising, sale or sharing of personal information, an appeal of a denied request, or use of an authorized representative, you may contact us to exercise them. We do not currently identify targeted advertising, sale, or sharing practices in the site code. We do not claim that every jurisdiction-specific right applies to every user.</p>
        <p>For India, we will handle requests and grievances according to applicable Indian data-protection requirements as they apply to the processing in question. Rights and statutory procedures can depend on the law's commencement and applicability. For users in the EEA, UK, Canada, or US states, rights depend on whether the relevant law applies to Ipnia and the particular processing. We have not identified code or business configuration that establishes a separate operating presence or targeted marketing in those regions.</p>
        <p>To make a request, email <a className="underline" href="mailto:Help@ipnia.com?subject=Privacy%20request">Help@ipnia.com</a> with “Privacy request” in the subject and describe the right you wish to exercise. We may ask for information reasonably needed to verify your identity or authority before acting. An authorized representative may need to provide proof of authority where the law permits representation.</p>
      </>,
    },
    {
      title: "10. Access, Correction, and Deletion Requests",
      content: <Paragraphs children={[
        "We will review a request, verify identity where reasonable, and respond within the time required by applicable law. If a request is denied in whole or in part, we will explain the reason and any review or appeal process required by law. Some information cannot be changed or erased on request when it must be retained for a pending or completed booking, payment reconciliation, fraud prevention, security, legal obligations, accounting, or the establishment or defence of a claim. We will limit or dispose of it when the retention purpose ends, as appropriate.",
      ]} />,
    },
    {
      title: "11. Data Security",
      content: <Paragraphs children={[
        "We use reasonable technical, organizational, and administrative measures designed to protect information against unauthorized access, alteration, disclosure, loss, or misuse. Account passwords are processed by the server as password hashes, and payment credentials are entered in Cashfree hosted checkout. We do not claim a particular certification or guarantee that any transmission or storage system is completely secure.",
        "Keep your account credentials private and contact Help@ipnia.com promptly if you suspect unauthorized access, an account compromise, or misuse of your information. We will assess and respond to security incidents, including providing notifications, where required by applicable law.",
      ]} />,
    },
    {
      title: "12. How Long We Keep Information",
      content: <Paragraphs children={[
        "We keep information only as long as reasonably needed for the purpose for which it was collected, including providing the Services, maintaining account and pending or completed booking and payment records, responding to support requests, preventing fraud, meeting legal and accounting duties, and resolving disputes. The period depends on the type of information, the status of a request or booking, and applicable requirements. We do not publish a fixed retention period because the project does not establish one. When information is no longer needed, we delete, anonymize, or securely dispose of it as appropriate.",
      ]} />,
    },
    {
      title: "13. International Processing and Transfers",
      content: <Paragraphs children={[
        "Travel, payment, database, and hosting providers may process information in locations outside India or your country of residence. The project does not establish the precise processing countries or hosting regions for every provider, so we do not state that data is stored in a particular country. Where a transfer is subject to legal safeguards, we will use safeguards required by applicable law and provide further information where required.",
      ]} />,
    },
    {
      title: "14. Changes to This Policy",
      content: <Paragraphs children={[
        "We may revise this Privacy Policy when our Services, data practices, or legal obligations change. The updated policy will be posted here with a new revision date. If a change is material or additional notice or consent is required by law, we will take the required steps before applying it.",
      ]} />,
    },
    {
      title: "15. Contact and Privacy Requests",
      content: <><p>For privacy questions, requests, or complaints, contact:</p><address className="not-italic"><ul className="list-disc space-y-1 pl-6">
        <li>Website: <a className="underline" href="https://ipnia.com">https://ipnia.com</a></li>
        <li>Privacy requests and customer support: <a className="underline" href="mailto:Help@ipnia.com">Help@ipnia.com</a></li>
        <li>Telephone: <a className="underline" href="tel:+911145534440">+91 11 4553 4440</a></li>
        <li>Business name displayed on the website: Ipnia Services Pvt Ltd</li>
        <li>Published business address: A199 Gujranwala Town Part 01, Delhi 110009, India</li>
      </ul></address><p>The project does not include company-registration documentation or name a separate Data Protection Officer. The registered legal name and address, designated privacy/grievance contact, and any DPO details should be verified by the business owner before this policy is treated as final.</p></>,
    },
  ]}
/>

export default PrivacyPolicy;
