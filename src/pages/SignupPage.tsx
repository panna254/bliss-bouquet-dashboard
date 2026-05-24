import { FormEvent, useMemo, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { getRedirectParam, resolvePostAuthRedirect } from "@/services/authRedirect.service";
import { signup } from "@/services/auth.service";

const SignupPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { refreshSession } = useAuth();
  const redirect = useMemo(() => getRedirectParam(location.search), [location.search]);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);

    if (!fullName.trim() || !email.trim() || password.length < 8) {
      setErrorMessage("Name, email, and a password of at least 8 characters are required.");
      return;
    }

    try {
      setIsSubmitting(true);
      const session = await signup({ fullName: fullName.trim(), email: email.trim(), password });
      await refreshSession();
      navigate(resolvePostAuthRedirect(session, redirect), { replace: true });
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to create account.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead title="Create Account | Bliss Bouquet Kenya" description="Create a Bliss Bouquet account to checkout and view orders." />
      <Header />
      <main className="container flex min-h-[70vh] items-center justify-center py-12">
        <form className="w-full max-w-md space-y-5 rounded-lg border bg-background p-6 shadow-soft" onSubmit={handleSubmit}>
          <div>
            <h1 className="font-heading text-2xl font-semibold">Create your account</h1>
            <p className="mt-1 text-sm text-muted-foreground">Your account will be created as a customer account.</p>
          </div>

          {errorMessage && (
            <Alert variant="destructive">
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="signup-name">Full Name</Label>
            <Input id="signup-name" value={fullName} onChange={(event) => setFullName(event.target.value)} disabled={isSubmitting} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="signup-email">Email</Label>
            <Input id="signup-email" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} disabled={isSubmitting} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="signup-password">Password</Label>
            <div className="relative">
              <Input
                id="signup-password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                disabled={isSubmitting}
                className="pr-12"
              />
              <Button type="button" variant="ghost" size="icon" className="absolute right-0 top-0" onClick={() => setShowPassword((current) => !current)} disabled={isSubmitting}>
                {showPassword ? <EyeOff /> : <Eye />}
              </Button>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Account"}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link className="font-medium text-primary hover:underline" to={`/login${redirect ? `?redirect=${encodeURIComponent(redirect)}` : ""}`}>
              Sign in
            </Link>
          </p>
        </form>
      </main>
      <Footer />
    </div>
  );
};

export default SignupPage;
