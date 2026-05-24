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
import { login } from "@/services/auth.service";

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { refreshSession } = useAuth();
  const redirect = useMemo(() => getRedirectParam(location.search), [location.search]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);

    if (!email.trim() || !password) {
      setErrorMessage("Email and password are required.");
      return;
    }

    try {
      setIsSubmitting(true);
      const session = await login({ email: email.trim(), password });
      await refreshSession();
      navigate(resolvePostAuthRedirect(session, redirect), { replace: true });
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to sign in.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead title="Login | Bliss Bouquet Kenya" description="Sign in to continue checkout or view your orders." />
      <Header />
      <main className="container flex min-h-[70vh] items-center justify-center py-12">
        <form className="w-full max-w-md space-y-5 rounded-lg border bg-background p-6 shadow-soft" onSubmit={handleSubmit}>
          <div>
            <h1 className="font-heading text-2xl font-semibold">Welcome back</h1>
            <p className="mt-1 text-sm text-muted-foreground">Sign in to continue with Bliss Bouquet Kenya.</p>
          </div>

          {errorMessage && (
            <Alert variant="destructive">
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="login-email">Email</Label>
            <Input
              id="login-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="login-password">Password</Label>
            <div className="relative">
              <Input
                id="login-password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                disabled={isSubmitting}
                className="pr-12"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0"
                onClick={() => setShowPassword((current) => !current)}
                disabled={isSubmitting}
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </Button>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Signing in..." : "Sign In"}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            New here?{" "}
            <Link className="font-medium text-primary hover:underline" to={`/signup${redirect ? `?redirect=${encodeURIComponent(redirect)}` : ""}`}>
              Create an account
            </Link>
          </p>
        </form>
      </main>
      <Footer />
    </div>
  );
};

export default LoginPage;
