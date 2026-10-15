import { Link } from "react-router-dom";
import { LegalPage, Paragraphs } from "@/components/legal/LegalPage";

const RefundPolicy = () => (
  <LegalPage
    title="Cancellation & Refund Policy"
    path="/refund-policy"
    description="How Ipnia handles payment, cancellation, change, and refund requests for its current travel search and booking flows."
    sections={[
      {
        title: "1. Introduction and scope",
        content: <Paragraphs children={[
          <>This policy explains how to contact Ipnia about a payment, cancellation, change, or refund request. It applies to flight and hotel requests made through the current Ipnia website. Read it with our <Link className="underline" to="/terms-and-conditions">Terms & Conditions</Link> and <Link className="underline" to="/privacy-policy">Privacy Policy</Link>.</>,
          "Refund eligibility depends on what was actually purchased, the status of the payment and any supplier booking, the fare or property terms shown for that specific service, and applicable law. A payment receipt or Ipnia reference alone does not establish that an airline ticket or hotel room was issued or reserved.",
        ]} />,
      },
      {
        title: "2. Flight cancellations and refunds",
        content: <Paragraphs children={[
          "Ipnia currently lets customers search flight offers and submit payment for a flight request. The website does not currently provide an airline ticket purchase, ticket issuance, or self-service cancellation workflow. A successful payment therefore confirms the payment transaction; it does not by itself confirm an airline booking or create a ticket eligible for cancellation.",
          "If Ipnia separately confirms that an airline booking has been made, the airline's fare conditions and applicable law determine whether it can be cancelled, changed, or refunded and what supplier charges may apply. Contact Ipnia support with your payment reference so we can review the status and explain any available next steps. Do not assume that a flight has been booked until you receive a separate supplier booking confirmation and ticket details.",
        ]} />,
      },
      {
        title: "3. Changes and airline schedule changes",
        content: <Paragraphs children={[
          "The current website does not offer an automated flight change or cancellation service. If you have received a separate airline booking confirmation and the airline changes or cancels the service, contact Ipnia support. Available options, including any refund or rebooking, depend on the airline's rules, the confirmed booking, and applicable law. We cannot promise a particular alternative or outcome before the supplier reviews the case.",
        ]} />,
      },
      {
        title: "4. Hotel search, deposits, and cancellations",
        content: <Paragraphs children={[
          "Hotel search currently uses place listings. A listing or search result is not a room reservation and does not establish a room rate, availability, or property cancellation conditions.",
          "For a hotel-only request, the website may collect a displayed deposit while Ipnia follows up about availability and the final stay amount. Payment of that deposit does not itself guarantee a room or confirm a stay. For a combined flight and hotel request, the hotel arrangement is handled separately after flight payment; it is not included as a confirmed hotel booking by that payment.",
          "Cancellation, change, no-show, and refund conditions for a hotel can be stated only for a specific stay once its property and terms have been confirmed to you. Contact support if you paid a hotel deposit and want to cancel or ask for its status. Any refund decision will be reviewed against the actual arrangement, payment status, and applicable law.",
        ]} />,
      },
      {
        title: "5. Payment failures, pending payments, and duplicate charges",
        content: <Paragraphs children={[
          "A payment can show as pending, failed, or incomplete while the payment provider or bank updates its records. Check the payment status before trying again. If your account was debited but Ipnia does not show a completed payment, or you see what appears to be a duplicate debit, contact support with the Ipnia payment order reference, transaction date, amount, and the email used for the request. Do not send full card details, passwords, or one-time passcodes.",
          "Ipnia will review the payment record and, where needed, the payment provider's transaction information. A pending or failed status alone does not confirm that funds were captured or that a refund has been initiated. Any captured payment for which the requested service was not confirmed will be reviewed and addressed under the transaction facts and applicable law.",
        ]} />,
      },
      {
        title: "6. Payment confirmation and travel confirmation",
        content: <Paragraphs children={[
          "Cashfree payment confirmation means the payment transaction succeeded. It does not by itself mean a flight ticket was issued, a PNR was created, or a hotel room was reserved. An Ipnia-generated reference identifies a payment request and is not an airline ticket, PNR, or hotel voucher. Wait for separate supplier confirmation before treating travel as booked.",
          "If payment succeeded but you have not received separate travel confirmation, contact support promptly so the request can be checked. The current website does not provide an automated ticket-issuance, hotel-reservation, or refund-processing workflow.",
        ]} />,
      },
      {
        title: "7. How to contact us about a request",
        content: <>
          <p>Email <a className="underline" href="mailto:Help@ipnia.com">Help@ipnia.com</a> or call <a className="underline" href="tel:+911145534440">+91 11 4553 4440</a>. There is no self-service booking management or cancellation tool in the current website.</p>
          <p>To help us locate the request, include your name, account email, Ipnia payment order reference, transaction date and amount, and the flight route or hotel request and travel dates if relevant. Share only the information needed to identify the transaction. Do not email full payment card details, passwords, or one-time passcodes.</p>
        </>,
      },
      {
        title: "8. Refund review and processing time",
        content: <Paragraphs children={[
          "The current Ipnia code does not define a refund request endpoint, a standard approval workflow, or a guaranteed processing period. We therefore do not promise a fixed number of days for review or for funds to appear. If a refund is approved or otherwise required, the timing can depend on the payment provider, bank, supplier, and applicable legal requirements. Support will provide information available for the individual request.",
        ]} />,
      },
      {
        title: "9. Refund method, fees, and taxes",
        content: <Paragraphs children={[
          "The current website does not specify a default refund method. If a refund is due, the available method will depend on the payment transaction, payment provider, and applicable requirements; contact support for the handling of your case.",
          "Any fare, property, or supplier cancellation amount must be based on the terms applicable to the confirmed service and the information disclosed for that service. The current website does not identify a general Ipnia cancellation fee. No fee or deduction is promised by this policy; any amount charged or retained must have a valid basis and comply with applicable law. Taxes and other amounts will be handled according to the transaction details and applicable requirements.",
        ]} />,
      },
      {
        title: "10. Discounts and promotional credits",
        content: <Paragraphs children={[
          "The current flight and hotel payment flow does not provide a coupon, discount-code, or promotional-credit feature. If Ipnia offers one in a future transaction, the terms shown with that offer will apply, subject to applicable law.",
        ]} />,
      },
      {
        title: "11. Disputes and suspected unauthorized payments",
        content: <Paragraphs children={[
          "If you do not recognize a payment, contact Ipnia support and your bank or payment provider promptly. Ipnia may review transaction information with its payment provider to investigate a reported payment or suspected misuse. You may also use any dispute or complaint process available through your bank, payment provider, or applicable law. Contacting Ipnia does not limit those rights.",
        ]} />,
      },
      {
        title: "12. Consumer rights",
        content: <Paragraphs children={[
          "Nothing in this policy is intended to exclude or reduce a right or remedy that cannot lawfully be excluded or reduced. Your rights depend on the laws that apply to you and the particular service and transaction. Where a policy term conflicts with a mandatory legal requirement, the mandatory requirement applies.",
        ]} />,
      },
      {
        title: "13. Updates to this policy",
        content: <Paragraphs children={[
          "We may update this policy when the website's booking or payment flows, supplier arrangements, or legal requirements change. The revision date at the top of this page shows when the current text was last updated.",
        ]} />,
      },
      {
        title: "14. Contact information",
        content: <Paragraphs children={[
          <>For cancellation, payment, or refund questions, email <a className="underline" href="mailto:Help@ipnia.com">Help@ipnia.com</a> or call <a className="underline" href="tel:+911145534440">+91 11 4553 4440</a>. You can also visit <a className="underline" href="https://ipnia.com">ipnia.com</a>.</>,
        ]} />,
      },
    ]}
  />
);

export default RefundPolicy;
