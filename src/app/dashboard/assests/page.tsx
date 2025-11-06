import { Divide } from "lucide-react";
import UploadAssets from "@/components/dashboard/upload-assets";
import AssetGrid from "@/components/dashboard/asset-grid";
import { category } from "@/lib/db/schema";
import { getcategories } from "@/actions/dashboard-action";

async function UserAssetsPage(){

  const [categories] = await Promise.all([getcategories()])

    return <div className="container py-6" >
        <div className="flex justify-between items-center mb-6" >
            <h1 className="text-2xl font-bold text-gray-900"> Administrator</h1>
            <UploadAssets categories={categories || []} />
        </div>
        <AssetGrid/>
    </div>
}
export default  UserAssetsPage ;


