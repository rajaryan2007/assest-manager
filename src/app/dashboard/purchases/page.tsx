import { auth } from "@/lib/auth";
import { Divide, Download, FileText } from "lucide-react";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { getAllUserPurchasedAssetsAction } from "@/actions/payment-action";
import { invoiceRelation } from "@/lib/db/schema";
import { getUserInvoiceAction } from "@/actions/invoice-action";
import Image from "next/image";
import { Button } from "@/components/ui/button";

async function UserPurchasesPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (session === null) return null;

  if (!session?.user) redirect("/login");
  if (session?.user?.role === "admin") redirect("/");

  const purchaseResult = await getAllUserPurchasedAssetsAction();
  const invoiceResult = await getUserInvoiceAction();

  const purchases = Array.isArray(purchaseResult) ? purchaseResult : [];
  const invoices =
    invoiceResult.success && invoiceResult.invoice ? invoiceResult.invoice : [];
  const purchaseToInvoiceMap = new Map();
  invoices.forEach((inv) => purchaseToInvoiceMap.set(inv.purchaseId, inv.id));

  console.log("purchaseResult raw =>", purchaseResult);
  console.log("invoiceResult raw =>", invoiceResult);

  return (
    <div className="container py-12">
      <h1 className="text-2xl font-bold mb-6">My Purchase</h1>
      {purchases.length === 0 ? (
        <p>you hart purchase yet</p>
      ) : (
        <div className="space-y-4">
          {purchases.map(({ purchase, asset }) => (
            <div
              key={purchase.id}
              className="flex items-center gap-4 bg-white rounded-lg border hover:shadow-sm"
            >
              <div className="relative w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                <Image
                  src={asset.fileUrl as string}
                  alt={asset.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-grow min-w-0">
                <h3 className="font-medium truncate">{asset?.title}</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Purchased at{" "}
                  {new Date(purchase.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div>
                <Button size="sm" asChild className="bg-black m-3 text-white">
                  <a href={`/api/downlaod/${asset.id}`} download>
                    <Download className="mr-2 w-4 h-4" />
                    Download
                  </a>
                </Button>
                {purchaseToInvoiceMap.has(purchase.id) && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="p-3 m-3"
                    asChild
                  >
                    <a
                      href={`/api/invoice/${purchaseToInvoiceMap.get(
                        purchase.id
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FileText className="mr-2 w-4 h-4" />
                      Invoice
                    </a>
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
export default UserPurchasesPage;
