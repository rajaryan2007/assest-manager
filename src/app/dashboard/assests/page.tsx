import { Divide } from "lucide-react";
import UploadAssets from "@/components/dashboard/upload-assets";
import AssetGrid from "@/components/dashboard/asset-grid";
import { category } from "@/lib/db/schema";
import { getcategories, getUserAssetsAction } from "@/actions/dashboard-action";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

async function UserAssetsPage() {

    const session = await auth.api.getSession({
        headers: await headers()
    })

    if (session === null) return null
    const [categories, assets] = await Promise.all([getcategories(), getUserAssetsAction(session?.user?.id)])

    
    
    
    return <div className="container py-6" >
        <div className="flex justify-between items-center mb-6" >
            <h1 className="text-2xl font-bold text-gray-900"> Assest</h1>
            <UploadAssets categories={categories || []} />
        </div>
        <AssetGrid assets={assets} />
    </div>
}
export default UserAssetsPage;


