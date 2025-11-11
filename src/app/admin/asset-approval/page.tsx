import { approveAssestAction, getPendingAssestAction, rejectAssestAction } from "@/actions/admin-actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { rejects } from "assert";
import { formatDistanceToNow } from "date-fns";
import { User } from "lucide-react";
import Image from "next/image";

async function AssetsApprovalPage() {
  const pendingAssets = await getPendingAssestAction();

  return (
    <div className="px-4">
      {pendingAssets.length === 0 ? (
        <Card className="bg-white">
          <CardContent className="py-16 flex flex-col items-center justify-center">
            <p className="text-center text-slate-500 text-lg">
              All Assets have been reviewe
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {pendingAssets.map(({ asset, userName }) => (
            <div
              key={asset?.id}
              className="border rounded-lg overflow-hidden bg-white shadow-sm hover:shadow transition-shadow"
            >
              <div className="h-48 bg-slate-100 relative">
                <Image
                  src={asset.fileUrl as string}
                  alt={asset.title}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="p-4">
                <h3 className="font-medium truncate">{asset.title}</h3>
                {asset.description && (
                  <p className="text-xs text-slate-500">{asset.description}</p>
                )}
                <div className="flex justify-between items-center mt-3">
                  <span className="text-xs text-slate-500">
                    {formatDistanceToNow(new Date(asset.createdAt), {
                      addSuffix: true,
                    })}
                  </span>
                  <div className="flex items-center text-xs text-slate-400">
                    <User className="mr-2 w-4 h-4" />
                    {userName}
                  </div>
                </div>
              </div>

              <div className="p-4 flex justify-between items-center">
                <form action={async()=>{
                  'use server'
                  await approveAssestAction(asset.id)
                }} >
                  <Button className="bg-teal-500 hover:bg-teal-600 cursor-pointer">
                  Approve
                </Button>
                </form>
                <form action={async()=>{
                  'use server'
                  await rejectAssestAction(asset.id)
                }}>
                  <Button className="bg-red-500 hover:bg-red-600 cursor-pointer">
                  Reject
                </Button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AssetsApprovalPage;
