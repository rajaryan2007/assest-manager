import { auth } from "@/lib/auth";
import { Divide } from "lucide-react";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

async function GalleryPage() {
  const session = await auth.api.getSession({
    headers: await headers()
  })
  if(session && session?.user?.role ==='admin') redirect('/')

  return (
    <div>
      <h1>Gallery Page</h1>
    </div>
  );
}
export default GalleryPage;
