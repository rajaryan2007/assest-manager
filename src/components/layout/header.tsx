"use client";

import { usePathname } from "next/navigation";

function Header() {
  const pathname = usePathname();
  const isLoginPage: boolean = pathname === "/login";

  console.log(pathname);
  if (isLoginPage) {
    return null;
  }

  return <div>Header</div>;
}

export default Header;
