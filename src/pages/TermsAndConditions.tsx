import { Link } from "react-router-dom";
import { Bullets, LegalPage, Paragraphs } from "@/components/legal/LegalPage";

const TermsAndConditions = () => <LegalPage
  title="Terms & Conditions"
  path="/terms-and-conditions"
  description="Terms for using Ipnia flight and hotel search, payment, account, and travel support features."
  sections={[
    {
      title: "Introduction and Acceptance",
      content: <Paragraphs children={[
        <>These Terms & Conditions ("Terms") govern your access to and use of Ipnia's website, search tools, account features, payment flow, and related travel information (together, the "Services"). "Ipnia," "we," "us," and "our" refer to the business operating the Ipnia website; the site currently identifies that business as Ipnia Services Pvt Ltd. "You" means a person using the Services.</>,
        <>Ipnia currently provides flight search using Duffel flight offers, hotel search using Google Places, account features, and a Cashfree-hosted payment flow for certain flight and hotel requests. A search result, selected offer, payment order, successful payment, or Ipnia-generated payment reference does not by itself mean that an airline ticket or hotel room has been reserved or confirmed. Review the <Link className="underline" to="/privacy-policy">Privacy Policy</Link> and the <Link className="underline" to="/cancellation-refund-policy">Cancellation & Refund Policy</Link> as well.</>,
        "By accessing or using the Services, you agree to these Terms to the extent permitted by applicable law. If you do not agree, do not use the relevant Services. Where law requires explicit agreement before a particular transaction, that agreement must be obtained in the applicable flow; the current review checkbox confirms the traveller and booking details, not acceptance of these Terms.",
      ]} />,
    },
    {
      title: "1. Eligibility and Your Responsibilities",
      content: <><p>You must be legally able to use the Services and enter into a binding agreement under the law that applies to you. Ipnia does not set a separate numeric minimum age in the current booking flow. A parent, guardian, or authorized adult should manage travel requests for a child where required by law.</p><Bullets items={[
        "Provide accurate, complete, and current search, account, passenger, guest, and payment-contact information, and correct errors before proceeding.",
        "If you provide information or request travel for another person, have their authority to do so and to accept the relevant supplier conditions on their behalf.",
        "Keep your account credentials confidential and promptly notify Ipnia if you suspect unauthorized account use.",
        "Use the Services lawfully and comply with the terms of the airline, accommodation provider, payment provider, or other supplier involved.",
      ]} /><p>We may request information reasonably necessary to verify a transaction, meet legal requirements, or protect the Services. If required information is not provided or cannot be verified, the requested process may not continue.</p></>,
    },
    {
      title: "2. What Ipnia's Services Do",
      content: <Paragraphs children={[
        "Ipnia provides tools to search and compare travel options and submit certain payment or travel requests. The live integrations visible in the project provide flight offer search through Duffel, lodging search and place information through Google Places, and payment checkout through Cashfree. The project does not show an automated Duffel ticket-purchase/order-creation integration or a hotel inventory/reservation integration.",
        "For that reason, Ipnia search is not itself a booking service confirmation. A selected flight may be presented for review and payment, but supplier acceptance, ticket issuance, and a PNR require a separate supplier confirmation. Hotel listings are search information; the hotel-only flow collects the deposit shown at checkout and presents it as a request for Ipnia to follow up on room availability and the final stay amount. Selecting a hotel or paying that deposit does not itself reserve a room. A hotel selected with a flight is presented for follow-up with Ipnia after flight payment; it is not included in the flight amount charged by Cashfree.",
        "The website may display a payment-success page and an Ipnia-generated reference after payment verification. That reference identifies the payment flow and is not an airline PNR, ticket number, hotel confirmation, or proof that a supplier accepted a reservation. Do not make non-refundable onward arrangements until you receive an applicable supplier or Ipnia confirmation that clearly states the service is confirmed.",
      ]} />,
    },
    {
      title: "3. Flight Search and Flight Requests",
      content: <Paragraphs children={[
        "Flight search requests are sent to Duffel to retrieve available offers. An offer can change or expire. When a flight payment order is created, Ipnia retrieves the selected offer again and calculates the amount from the offer data available then. If the offer is no longer available or its price cannot be verified, payment-order creation may fail or the displayed amount may need to change before you proceed.",
        "The current codebase creates a Cashfree payment order for the selected offer; it does not show an automated request to Duffel to purchase a ticket after payment. Payment success is therefore not ticket issuance or supplier confirmation. Any later ticket, itinerary, PNR, or booking confirmation must come from the applicable supplier or be separately confirmed by Ipnia. Contact support if the payment succeeds but no clear travel confirmation follows.",
        "Airline fare conditions, baggage allowance, seat selection, check-in, changes, cancellations, refunds, and ticket restrictions vary by airline and fare. The relevant airline's conditions of carriage and fare rules apply to the travel service. Schedules, terminals, aircraft, routes, and operating or marketing carriers may also change under airline rules and applicable law.",
      ]} />,
    },
    {
      title: "4. Hotel Search and Hotel Requests",
      content: <Paragraphs children={[
        "Hotel listings, place details, photographs, and location information in the current search experience come from Google Places. Search results do not show live room inventory or create a reservation. Prices, room types, occupancy limits, amenities, check-in and check-out times, property rules, taxes, deposits, and cancellation or no-show conditions must be confirmed with Ipnia and/or the property before you rely on a stay.",
        "The hotel-only payment flow charges a booking confirmation deposit in the amount shown before payment. The server uses the configured hotel deposit amount (with a code default if no environment value is supplied). Ipnia presents this as a request for follow-up confirmation of room availability and final stay amount; it is not payment of the full stay price and does not guarantee a room. When a hotel is selected alongside a flight, the current checkout charges the flight amount only; the hotel amount is handled separately with Ipnia after flight payment confirmation.",
        "No universal hotel cancellation deadline, refund rule, room guarantee, or property charge applies through the search listing. Any stay is subject to property availability, the terms provided for that specific arrangement, and applicable law. Do not treat a listing or deposit receipt as a hotel voucher or confirmed booking.",
      ]} />,
    },
    {
      title: "5. Prices, Taxes, Currency, and Fees",
      content: <Paragraphs children={[
        "Flight search prices come from supplier offer data and can change before the payment order is created. The server verifies the selected offer and calculates the flight amount at order creation. Hotel-only payment is a deposit, not a final accommodation total; a combined flight-and-hotel selection charges the flight amount in the current flow. Check the final amount displayed at checkout before paying.",
        "The payment API currently accepts INR. The amount due through Ipnia should be shown before you launch Cashfree checkout. Your bank, card issuer, or payment provider may apply separate foreign-exchange or transaction charges under its own terms. Taxes and supplier charges are included only to the extent shown in the offer or checkout. Additional supplier charges may apply for optional services or property requirements; Ipnia will disclose any Ipnia-imposed fee before the applicable transaction as required by law.",
        "If a price or availability discrepancy is found before payment, the request may be paused or corrected so you can review the updated information. If a discrepancy is found after payment, contact support. Ipnia will investigate and address it under the applicable supplier terms and law; no term here limits mandatory consumer remedies.",
      ]} />,
    },
    {
      title: "6. Payments and Payment Status",
      content: <Paragraphs children={[
        "The current booking checkout uses Cashfree hosted checkout. Ipnia creates a payment order and stores an Ipnia order reference, selected amount, currency, customer name, email, phone number, and payment status in its payment records. Cashfree processes payment credentials in its hosted flow. Ipnia's application does not claim to store complete card details.",
        "A transaction may be pending, successful, failed, or abandoned by the user. The payment-status page checks status with Ipnia's payment service, which uses Cashfree order and webhook information. A pending status means payment has not yet been verified as successful. Do not submit a duplicate payment while a status is being checked; contact Help@ipnia.com with the order reference if the result remains unclear. Payment disputes or reversals may also be subject to the rules of Cashfree, your payment method, and your bank.",
        "Payment success confirms the payment transaction only. It does not by itself confirm a flight, issue a ticket, or reserve a hotel room. Refunds are not automatic solely because a payment is pending, failed, or a supplier request did not proceed; any refund requires review under the applicable transaction, supplier terms, and law.",
      ]} />,
    },
    {
      title: "7. Cancellations, Changes, and Refund Requests",
      content: <Paragraphs children={[
        "The current website does not provide a self-service airline or hotel booking-management, cancellation, or refund tool. To raise a booking or payment issue, email Help@ipnia.com with the Ipnia order reference, contact email used, and a description of the request. Do not include full card details or unnecessary sensitive documents in the email.",
        "Whether a request can be cancelled, changed, or refunded depends on whether a supplier booking exists, the applicable airline fare or property conditions, the status of the payment and request, supplier decisions, and mandatory law. Search selections and unconfirmed requests may not have supplier cancellation rights because they may not be reservations. A submitted request is not complete until Ipnia or the relevant supplier confirms the action.",
        <>The project does not establish an automated supplier cancellation or refund workflow or a fixed refund processing period. If a refund is approved, the available amount and timing depend on the applicable supplier decision, payment provider, payment method, and bank. No fixed timeline or full refund is promised. See the <Link className="underline" to="/cancellation-refund-policy">Cancellation & Refund Policy</Link> for the current request guidance.</>,
      ]} />,
    },
    {
      title: "8. Passenger Details and Travel Documents",
      content: <Paragraphs children={[
        "Enter each traveller's name and other details accurately and as they appear on the identity or travel documents required for the itinerary. The current traveller form collects date of birth, nationality, email, and phone details; it asks for passport details for international routes identified by the booking flow. Do not submit passport information for a domestic journey unless the applicable flow or supplier requires it.",
        "You are responsible for ensuring that each traveller has valid identification, passport, visa, transit permission, health documents, and other documents required by the destination, transit countries, airline, and itinerary. Requirements can change and vary by traveller. Verify them with official authorities and the airline before departure. Incorrect or incomplete information may prevent a supplier booking, lead to charges, or result in denied boarding or entry.",
      ]} />,
    },
    {
      title: "9. Accounts and Security",
      content: <Paragraphs children={[
        "You may create an account using the available registration form, which requests your name, email, password, and optional phone number. Keep your password and account token secure. Notify Ipnia at Help@ipnia.com if you suspect unauthorized access. We may take proportionate steps to protect accounts and the Services, investigate suspected fraud or misuse, meet legal duties, or address a material breach, subject to applicable law and any rights you have.",
      ]} />,
    },
    {
      title: "10. Acceptable Use",
      content: <><p>You may not use the Services to:</p><Bullets items={[
        "Submit false, misleading, or fraudulent search, passenger, guest, account, or payment details, or book for another person without authority.",
        "Use stolen or unauthorized payment credentials, evade payment controls, or abuse payment or refund processes.",
        "Attempt unauthorized access to accounts, servers, databases, or systems; interfere with site operation; introduce malware; or disrupt another person's use.",
        "Scrape, crawl, or use bots to access or collect data in a manner that violates law, these Terms, or technical restrictions, or commercially copy site content without permission.",
        "Impersonate Ipnia, a supplier, or another user, or violate applicable law or a third party's rights.",
      ]} /><p>We may investigate and restrict access where reasonably needed to protect security, respond to suspected fraud, perform maintenance, comply with law, or address prohibited use. Any action will be subject to applicable law.</p></>,
    },
    {
      title: "11. Third-Party Suppliers and External Services",
      content: <Paragraphs children={[
        "Duffel supplies flight offer search; Google Places supplies lodging search and place data; Cashfree supplies hosted payment checkout and payment-status services. Airlines, hotels, banks, and other travel suppliers may independently provide or control travel services. These third parties may have their own terms, privacy notices, fare rules, property policies, and cancellation conditions.",
        "Ipnia does not control all supplier systems, inventory, schedules, prices, decisions, or performance. This does not exclude or reduce duties or liability Ipnia has for its own statements, actions, or services under applicable law. Links to external sites are provided for convenience; their content and terms are controlled by those third parties.",
      ]} />,
    },
    {
      title: "12. Website Content, Availability, and Errors",
      content: <Paragraphs children={[
        "Travel offers, property descriptions, images, schedules, inventory, and other information can change or contain errors, especially when supplied by third parties. We may correct a discrepancy, update or withdraw search information, or pause a payment request while checking a material error. We aim to keep the Services available but do not guarantee uninterrupted access, error-free operation, or availability of every integration. Maintenance, security events, outages, or supplier problems may affect access.",
        "General travel information on Ipnia is for convenience and is not a substitute for confirmation by an airline, property, official government source, or other responsible provider. Nothing in this section removes rights or remedies that cannot be excluded under law.",
      ]} />,
    },
    {
      title: "13. Intellectual Property",
      content: <Paragraphs children={[
        "Ipnia or its licensors own or are authorized to use the website's original branding, design, text, software, and other content, except where another owner is identified. You may use the Services for personal, lawful travel-related purposes. You may not reproduce, modify, distribute, sell, or commercially exploit protected content without permission, except where applicable law allows it. Airline, hotel, supplier, and other third-party names and marks belong to their respective owners and do not necessarily indicate endorsement.",
      ]} />,
    },
    {
      title: "14. Privacy and Communications",
      content: <Paragraphs children={[
        <>The <Link className="underline" to="/privacy-policy">Privacy Policy</Link> explains how Ipnia handles personal information. We may use contact information you provide for necessary account, payment, travel-request, support, or security communications. The current website does not show an automated SMS or promotional messaging system. Optional promotional email is separate from service-related messages and is sent only where implemented and permitted by law.</>,
      ]} />,
    },
    {
      title: "15. Liability and Consumer Rights",
      content: <Paragraphs children={[
        "To the extent permitted by applicable law, Ipnia is not responsible for indirect, incidental, special, or consequential loss arising from use of the Services. Ipnia is not the operator of an airline or hotel and cannot guarantee supplier schedules, inventory, content, or decisions. Nothing in these Terms excludes or limits liability that cannot legally be excluded or limits mandatory consumer rights, including rights relating to Ipnia's own conduct or services.",
        "Any liability restriction must be applied only to the extent allowed by the law governing the relevant claim. If a provision is not enforceable in a particular situation, it will not remove other rights or remedies available to you.",
      ]} />,
    },
    {
      title: "16. Events Outside Reasonable Control",
      content: <Paragraphs children={[
        "To the extent permitted by law, Ipnia is not responsible for a delay or failure caused by an event beyond its reasonable control, such as severe weather, natural disaster, public emergency, government action, labor disruption, infrastructure failure, or a widespread technology outage. This does not excuse any refund, consumer-protection, or other obligation that the law requires Ipnia to meet.",
      ]} />,
    },
    {
      title: "17. Responsibility for Misuse",
      content: <Paragraphs children={[
        "To the extent permitted by law, you may be responsible for direct losses and reasonable costs caused by your fraud, unlawful use of the Services, or material breach of these Terms. You are not responsible under this section for losses caused by Ipnia's own unlawful conduct, and no responsibility is imposed where the law does not allow it.",
      ]} />,
    },
    {
      title: "18. Governing Law and Disputes",
      content: <Paragraphs children={[
        "The website identifies Ipnia Services Pvt Ltd and publishes a Delhi address, but the project does not verify the registered legal entity, registered address, governing-law jurisdiction, or dispute forum. These Terms therefore do not designate a specific governing law, court, arbitration process, or waiver of court rights. The business owner must confirm these details with qualified counsel before publication. Mandatory consumer protections that apply to you are not displaced.",
      ]} />,
    },
    {
      title: "19. Changes, Severability, and Entire Agreement",
      content: <Paragraphs children={[
        "We may revise these Terms to reflect changes to the Services, suppliers, payment flow, or legal requirements. The current version and update date will be posted on this page. Where required by law, we will provide additional notice or obtain agreement before a change applies to you.",
        "If a provision is found unenforceable, the remaining provisions continue to apply to the extent permitted by law. A failure to enforce a provision on one occasion is not a waiver of the ability to enforce it later. These Terms, the Privacy Policy, the Cancellation & Refund Policy, and any supplier or transaction-specific terms shown to you together describe the rules relevant to your use, subject to applicable law and any mandatory rights.",
      ]} />,
    },
    {
      title: "20. Contact and Support",
      content: <><p>For questions about these Terms, a payment, or a travel request, use the support details currently published on the website:</p><Bullets items={[
        "Email: Help@ipnia.com",
        "Phone: +91 11 4553 4440",
        "Website: https://ipnia.com",
        "Business name displayed in the site footer: Ipnia Services Pvt Ltd",
        "Address displayed on the site: A199 Gujranwala Town Part 01, Delhi 110009, India",
      ]} /><p>The project's public pages do not establish whether the displayed business name and address are the registered legal details. The business owner should verify them and confirm the appropriate legal-notice contact before relying on this information as registered particulars.</p></>,
    },
  ]}
/>

export default TermsAndConditions;
