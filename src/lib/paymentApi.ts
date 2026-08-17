import { getApiBase } from "@/lib/apiBase";

export type CreateOrderResponse = {
  success: boolean;
  orderId: string;
  paymentSessionId: string;
  amount: number;
  currency: string;
  paymentStatus: string;
  message?: string;
};

export type PaymentStatusResponse = {
  success: boolean;
  payment?: {
    orderId: string;
    amount: number;
    currency: string;
    paymentStatus: string;
    paymentMethod?: string | null;
    customer: {
      name: string;
      email: string;
      phone: string;
    };
  };
  message?: string;
};

export async function createPaymentOrder(payload: {
  amount: number;
  currency?: string;
  customer: { name: string; email: string; phone: string };
}): Promise<CreateOrderResponse> {
  const res = await fetch(`${getApiBase()}/api/payments/create-order`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      amount: payload.amount,
      currency: payload.currency || "INR",
      customer: payload.customer,
    }),
  });

  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || "Failed to create payment order");
  }
  return data as CreateOrderResponse;
}

export async function getPaymentStatus(orderId: string): Promise<PaymentStatusResponse> {
  const res = await fetch(`${getApiBase()}/api/payments/${encodeURIComponent(orderId)}/status`);
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || "Failed to fetch payment status");
  }
  return data as PaymentStatusResponse;
}

export function getCashfreeMode(): "sandbox" | "production" {
  const mode = String(import.meta.env.VITE_CASHFREE_MODE || "sandbox").toLowerCase();
  return mode === "production" ? "production" : "sandbox";
}

declare global {
  interface Window {
    Cashfree?: (options: { mode: "sandbox" | "production" }) => {
      checkout: (opts: { paymentSessionId: string; redirectTarget?: string }) => Promise<unknown>;
    };
  }
}

export async function loadCashfreeSdk(): Promise<void> {
  if (window.Cashfree) return;
  await new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://sdk.cashfree.com/js/v3/cashfree.js";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Cashfree SDK"));
    document.body.appendChild(script);
  });
}

export async function openCashfreeCheckout(paymentSessionId: string) {
  await loadCashfreeSdk();
  if (!window.Cashfree) {
    throw new Error("Cashfree SDK unavailable");
  }
  const cashfree = window.Cashfree({ mode: getCashfreeMode() });
  return cashfree.checkout({
    paymentSessionId,
    redirectTarget: "_self",
  });
}
