import { Link } from "react-router-dom";
import { Mail } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function VerifyEmailSentPage() {
  return (
    <Card className="shadow-none border-0 sm:border sm:shadow-sm">
      <CardHeader className="items-center text-center space-y-3">
        <div className="w-14 h-14 rounded-full bg-soh-green-100 flex items-center justify-center">
          <Mail className="h-7 w-7 text-soh-green-700" />
        </div>
        <CardTitle className="text-2xl">Verify your email</CardTitle>
        <CardDescription>
          We&apos;ve sent a verification link to your email address. Click the
          link to activate your account.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-3 text-sm text-muted-foreground">
        <p>Didn&apos;t receive it? Check your spam folder.</p>
        <Link to="/auth/login" className="text-primary hover:underline font-medium">
          Back to sign in
        </Link>
      </CardContent>
    </Card>
  );
}
