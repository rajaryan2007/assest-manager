"use client";

import { signIn } from "@/lib/auth-client";
import { Button } from "../ui/button";

function LoginButton() {
   const handleLogin = async ()=>{
    await signIn.social({
      provider:"google",
      callbackURL:"/",
    })
   }


  return (
    <Button onClick={handleLogin} className="w-full bg-teal-500 hover:bg-teal-700 text-white py-6 text-base font-medium">
      <span> Sign In With Google</span>
    </Button>
  );
}

export default LoginButton;
