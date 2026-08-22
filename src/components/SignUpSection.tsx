import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";

const SignUpSection = () => {
  const { user } = useAuth();

  return (
    <section id="signup" className="py-20 px-4 sm:px-6 lg:px-8 bg-card/30">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Join <span className="hero-gradient">IPNIA</span> Today
          </h2>
          <p className="text-xl text-muted-foreground">
            Create an account to manage bookings and travel plans
          </p>
        </div>

        <Card className="card-hover">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">
              {user ? "You're signed in" : "Create your account"}
            </CardTitle>
            <CardDescription>
              {user
                ? `Signed in as ${user.fullName || user.email}`
                : "Use email and password — accounts are stored securely in our database"}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-3">
            {user ? (
              <Button asChild className="w-full h-12 text-base">
                <Link to="/dashboard">Go to Dashboard</Link>
              </Button>
            ) : (
              <>
                <Button asChild className="w-full h-12 text-base">
                  <Link to="/signup">Create Account</Link>
                </Button>
                <Button asChild variant="outline" className="w-full h-12 text-base">
                  <Link to="/login">Sign In</Link>
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default SignUpSection;
