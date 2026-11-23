import { useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useVerifyEmail } from "../hooks/use-auth";
import { extractApiError } from "@/services/generated/api-types";

export function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const mutation = useVerifyEmail();

  useEffect(() => {
    if (token && mutation.isIdle) {
      mutation.mutate({ token });
    }
    // only run once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  if (!token) {
    return (
      <Card className="shadow-none border-0 sm:border sm:shadow-sm">
        <CardHeader className="items-center text-center space-y-3">
          <AlertCircle className="h-10 w-10 text-destructive" />
          <CardTitle>Invalid link</CardTitle>
          <CardDescription>
            No verification token was found in this link.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Link to="/auth/login" className="text-sm text-primary hover:underline">
            Back to sign in
          </Link>
        </CardContent>
      </Card>
    );
  }

  if (mutation.isPending) {
    return (
      <Card className="shadow-none border-0 sm:border sm:shadow-sm">
        <CardHeader className="items-center text-center space-y-3">
          <Loader2 className="h-10 w-10 text-primary animate-spin" />
          <CardTitle>Verifying…</CardTitle>
          <CardDescription>Please wait a moment.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (mutation.isError) {
    return (
      <Card className="shadow-none border-0 sm:border sm:shadow-sm">
        <CardHeader className="items-center text-center space-y-3">
          <AlertCircle className="h-10 w-10 text-destructive" />
          <CardTitle>Verification failed</CardTitle>
          <CardDescription>
            {extractApiError(mutation.error)}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Link to="/auth/login" className="text-sm text-primary hover:underline">
            Back to sign in
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-none border-0 sm:border sm:shadow-sm">
      <CardHeader className="items-center text-center space-y-3">
        <CheckCircle className="h-10 w-10 text-soh-green-600" />
        <CardTitle>Email verified!</CardTitle>
        <CardDescription>
          Your account is now active. You can sign in.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center">
        <Link
          to="/auth/login"
          className="text-sm text-primary hover:underline font-medium"
        >
          Sign in now
        </Link>
      </CardContent>
    </Card>
  );
}
