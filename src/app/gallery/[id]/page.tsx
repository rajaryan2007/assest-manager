import { auth } from "@/lib/auth"
import { Badge, Divide, Download, Info, Loader2, ShoppingCart, Tag } from "lucide-react"
import { notFound, redirect } from "next/navigation"
import { headers } from "next/headers"
import { Suspense } from "react"
import { deflate } from "zlib"
import { getAssetById } from "@/actions/dashboard-action"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { createPaypalOrderAction } from "@/actions/payment-action"


interface GalleryDetailPageProps {
    params: {
        id: string
    }
}



function GalleryDetailsPage({ params }: GalleryDetailPageProps) {
    

    return (
        <Suspense
            fallback={
                <div className="flex items-center justify-center min-h-[65vh]" >
                    <Loader2 className="h-8 animate-spin text-black" />
                </div>
            }
        >
            <GalleryContent params={params} />
        </Suspense>
    )
}

export default GalleryDetailsPage

async function GalleryContent({ params }: GalleryDetailPageProps) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (session && session?.user?.role === "admin") {
        redirect("/");
    }

    const resolvedParams = await params;

    const result = await getAssetById(resolvedParams.id);




    if (!result) {
        notFound();
    }

    const { asset, categoryName, userName, userImage, userId } = result
    const initials = userName ? userName.split(" ")
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        : "U";


    const isAuthor = session?.user.id === userId;

    const hasPurchasedAsset = false;
    const resolvedParamsForOrder = await  params.id
    async function handlePurchase(){
        'use server'
        
        const result = await createPaypalOrderAction(resolvedParamsForOrder)
        if(result.alreadyPurchased){
            redirect(`/gallery/${params.id}?success=true`);
        }

        if(result.approvalLink){
            redirect(result.approvalLink)
        }

    }
    
    

    return <div className="min-h-screen container px-4 bg-white" >
        <div className="container py-12" >
            <div className="grid gap-12 md:grid-cols-3" >
                <div className="md:col-span-2 space-y-8" >
                    <div className="rounded-lg overflow-hidden bg-grey-100 border" >
                        <div className="relative w-full" >
                            <Image
                                src={asset.fileUrl as string}
                                alt={asset.title}
                                width={1200}
                                height={800}
                                className="w-full h-auto object-contain"
                                priority
                            />
                        </div>
                    </div>
                    <div className="flex items-center justify-between" >
                        <div>
                            <h1 className="text-3xl font-bold" >{asset?.title}</h1>
                            {
                                categoryName && (
                                    <Badge
                                        className="mt-2 bg-gray-200 text-gray-700 hover:bg-gray-300">
                                        <Tag className="mr-1 h-4 w-4" />
                                        {categoryName}
                                    </Badge>
                                )
                            }
                        </div>
                        <div>
                            <p className="text-sm font-medium" >{userName}</p>
                            <p className="text-xs text-grey-500" >creator</p>
                        </div>
                    </div>
                </div>
                <div className="space-y-6 rounded" >
                    <div className="sticky top-24">
                        <Card className="rounded-xl overflow-hidden border-0 shadow-lg">
                            <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-6 text-white">
                                <h3 className="text-xl font-bold mb-2">Premium Asset</h3>
                                <div>
                                    <span className="text-3xl font-bold">$5.00</span>
                                    <span className="ml-2 text-gray-300">One Time purchase</span>
                                </div>
                            </div>
                            <CardContent className="p-6">
                                <div className="space-y-4">
                                    {session?.user ? (
                                        isAuthor ? (
                                            <div className="bg-blue-50 text-blue-700 p-5 rounded-lg flex items-start gap-3">
                                                <Info className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" />
                                                <p className="text-sm">
                                                    This is your own asset. You can manage it from your asset dashboard.
                                                    You can't purchase your own asset.
                                                </p>
                                            </div>
                                        ) : hasPurchasedAsset ? (
                                            <Button asChild className="w-full bg-green-600 text-white h-12">
                                               <a download>
                                                 <Download  className="mr-2 w-6 h-6 " />
                                                 Download Asset
                                               </a>
                                            </Button>
                                        ) : (
                                            <form action={handlePurchase}>
                                                <Button type="submit" className="w-full bg-black text-white h-12">
                                                    <ShoppingCart className="w-5 h-5 mr-2" />
                                                    Purchase Now
                                                </Button>
                                            </form>
                                        )
                                    ) : (
                                        <Button asChild className="w-full bg-black text-white h-12">
                                            <Link href="/login">Sign in to Purchase</Link>
                                        </Button>
                                    )}
                                </div>
                            </CardContent>

                        </Card>
                    </div>

                </div>
            </div>
        </div>
    </div>;
}
