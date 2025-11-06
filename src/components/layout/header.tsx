"use client";

import { signOut, useSession } from "@/lib/auth-client";
import { LogOut, Package } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "../ui/button";
import { DropdownMenu, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator } from "../ui/dropdown-menu";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { useRouter } from "next/navigation";





function Header() {
  const pathname = usePathname();
  const isLoginPage: boolean = pathname === "/login";

  const router = useRouter()

  const { data: session, isPending } = useSession()
  const user = session?.user;
  const isAdminUser = user?.role === "admin"

  const handleLogout = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/")
        }
      }
    })
  }


  if (isLoginPage) {
    return null;
  }

  return <header className="fixed-top-0 left-0 right-0 z-50 border-b bg-white" >
    <div className="flex h-16 items-center justify-between px-4 w-full " >
      <div className="flex items-center gap-4" >
        <Link href="/" className="flex items-center gap-2" >
          <div className="p-2 rounded-md bg-teal-500" >
            <Package className="h-5 w-5 text-white" />
          </div>
          <span className="font-bold text-xl text-teal-600" >Asset Platform</span>
        </Link>
        <nav className="flex items-center gap-6">
           {!isPending && user && isAdminUser ? null : (
              <Link
                href="/gallery"
                className="text-sm font-medium hover:text-teal-600"
              >
                Gallery
              </Link>
            )}

          {!isPending && user && !isAdminUser && (
            <>
              <Link
                href="/dashboard/assests"
                className="text-sm font-medium hover:text-teal-600"
              >
                Assets
              </Link>
              <Link
                href="/dashboard/purchases"
                className="text-sm font-medium hover:text-teal-600"
              >
                My Purchases
              </Link>
            </>
          )}

          {!isPending && user && isAdminUser && (
            <>
              <Link
                href="/admin/asset-approval"
                className="text-sm font-medium hover:text-teal-600"
              >
                Assets Approval
              </Link>
              <Link
                href="/admin/setting"
                className="text-sm font-medium hover:text-teal-600"
              >
                Settings
              </Link>
            </>
          )}
        </nav>
      </div>
      <div className="flex items-center gap-6 " >
        {
          isPending ? null : user ? (
            <div className="flex item-center gap-3 " >
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="relative h-8 w-8 rounded-full"
                    variant={"ghost"}
                  >
                    <Avatar className="h-8 w-8 border-slate-300">
                      <AvatarFallback className="bg-teal-500 text-white">
                        {
                          user?.name ? user.name.charAt(0).toUpperCase() : "U"
                        }
                      </AvatarFallback>

                    </Avatar>

                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1" >
                      <p className="text-sm font-meduim leading-none" >
                        {user.name}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuItem onClick={handleLogout} >
                    <LogOut className="mr-2 h-2 w-4" />
                    <span className="font-medium" >Logout</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />



                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (<Link href="/login">
            <Button className="bg-teal-500 hover:bg-teal-600 text-white" >
              Login
            </Button>
          </Link>
          )}
      </div>
    </div>
  </header>
}

export default Header;
