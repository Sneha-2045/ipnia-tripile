import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const courseNames: Record<string, string> = {
  "ai-course": "Online Immersion Program",
  "ml-course": "India Immersion Program",
  "global-course": "Global Industry Exposure",
};

// Remove the hardcoded key and use Vite env variable
const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID;

declare global {
  interface Window {
    Razorpay?: any;
  }
}

const PaymentPage = () => {
  const { course } = useParams<{ course: string }>();
  const [phone, setPhone] = useState("");
  const [upi, setUpi] = useState("");
  const navigate = useNavigate();

  const displayName = courseNames[course || ""] || "Course";

  // Debug function to test backend connectivity
  const testBackendConnection = async () => {
    try {
      const response = await fetch("https://ipnia.com/api/health");
      const data = await response.json();
      console.log("Backend health check:", data);
      return data;
    } catch (error) {
      console.error("Backend connection failed:", error);
      return null;
    }
  };

  const handleRazorpayPayment = async () => {
    try {
      // Example: ₹999 (replace with your actual amount logic)
      let amount = 99900; // default in paise
      if (course === "ml-course") amount = 999900;
      if (course === "global-course") amount = 2499900;

      // 1. Create order on backend
      const response = await fetch("https://ipnia.com/api/create-razorpay-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.id) {
        throw new Error('Order ID not received from server');
      }

      // 2. Open Razorpay modal
      if (typeof window.Razorpay === 'undefined') {
        alert('Razorpay script not loaded. Please check your internet connection or try again.');
        return;
      }
      
      const options = {
        key: RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: "INR",
        name: "IPNIA",
        description: `${displayName} Payment`,
        order_id: data.id,
        handler: function (response: any) {
          console.log('Payment successful:', response);
          navigate(`/thankyou/${course}`);
        },
        prefill: {
          email: "",
          contact: phone
        },
        theme: { color: "#3399cc" },
        modal: {
          ondismiss: function() {
            console.log('Payment modal closed');
          }
        }
      };
      
      // @ts-ignore
      const rzp = new window.Razorpay(options);
      rzp.open();
      
    } catch (error) {
      console.error('Payment error:', error);
      alert(`Payment failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-4xl bg-card rounded-lg shadow-lg flex flex-col md:flex-row overflow-hidden">
        {/* Left Side */}
        <div className="flex-1 p-8 flex flex-col justify-center">
          <Card className="bg-transparent border-none shadow-none">
            <CardHeader>
              <CardTitle className="text-2xl mb-2">Complete Your Payment</CardTitle>
              <div className="text-muted-foreground mb-4">Payment Gateway: Razorpay (Testing Phase)</div>
              <div className="text-lg font-semibold mb-2">{displayName}</div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label htmlFor="phone" className="block text-sm font-medium mb-1">Phone Number</label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Enter your phone number"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full"
                />
              </div>
              <div>
                <label htmlFor="upi" className="block text-sm font-medium mb-1">UPI ID</label>
                <Input
                  id="upi"
                  type="text"
                  placeholder="Enter your UPI ID"
                  value={upi}
                  onChange={e => setUpi(e.target.value)}
                  className="w-full"
                />
              </div>
              <Button className="w-full h-12 text-base mt-2" onClick={handleRazorpayPayment}>
                Pay with UPI
              </Button>
            </CardContent>
          </Card>
        </div>
        {/* Right Side */}
      </div>
    </div>
  );
};

export default PaymentPage; 