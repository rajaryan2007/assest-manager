import LoginButton from "@/components/auth/login-button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Divide, Package } from "lucide-react";
import Link from "next/link";

function Loginpage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50">
      <Card className="w-full max-w-md shadow">
        <CardHeader className="text-center">
          <div className="mx-auto p-2 rounded-full bg-teal-500 w-fit">
            <Package className="h-6 w-6 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-teal-600">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-slate-600">
            Sign in to you account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LoginButton />
        </CardContent>
        <CardFooter className="flex justify-center">
          <Link
            href={"/"}
            className="text-sm text-slate-500 hover:text-teal-600"
          >
            Back To Home
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}

export default Loginpage;
