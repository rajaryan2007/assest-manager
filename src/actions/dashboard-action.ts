"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { asset, category, user } from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { z } from "zod";

const AssetSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  categoryId: z.number().positive("Please select a category"),
  fileUrl: z.url("Invalid file URL"),
  thumbnailUrl: z.url("Invalid thumbnail URL").optional(),
});

export async function getcategories() {
  try {
    return db.select().from(category);
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function uploadAssestAction(formData: FormData) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("You must be logged in to upload assets");
  }

  try {
    const validateFields = AssetSchema.parse({
      title: formData.get("title"),
      description: formData.get("description"),
      categoryId: Number(formData.get("categoryId")),
      fileUrl: formData.get("fileUrl"),
      thumbnailUrl: formData.get("thumbnailUrl"),
    });

    await db.insert(asset).values({
      title: validateFields.title,
      description: validateFields.description,
      fileUrl: validateFields.fileUrl,
      thumbnailUrl: validateFields.thumbnailUrl,
      isApproved: "pending",
      userId: session.user.id,
      categoryId: validateFields.categoryId,
    });

    revalidatePath("/dashboard/assets");
    return { success: true };
  } catch (e) {
    console.error(e);
    return { success: false, error: "Failed to upload the asset" };
  }
}

export async function getUserAssetsAction(userId: string) {
  try {
    return await db
      .select()
      .from(asset)
      .where(eq(asset.userId, userId))
      .orderBy(asset.createdAt);
  } catch (error) {
    console.log(error);
    return [];
  }
}


export async function getPublicAssetsAction(categoryId?: number) {
  try {
    let conditions = and(
      eq(asset.isApproved, 'approved')
    );

    if (categoryId) {
      conditions = and(conditions, eq(asset.categoryId, categoryId));
    }

    const query = await db.select({
      asset: asset,
      categoryName: category.name,
      userName: user.name
    })
      .from(asset)
      .leftJoin(category, eq(asset.categoryId, category.id))
      .leftJoin(user, eq(asset.userId, user.id))
      .where(conditions);

    return query; 
  } catch (e) {
    console.error(e);
    return []; 
  }
}


export async function getAssetById(assetId:string) {
  try {
    const [result] = await db.select({
      asset:asset,
      categoryName:category.name,
      userName:user.name,
      userImage:user.image,
      userId:user.id
    }).from(asset).leftJoin
   (category,eq(asset.categoryId,category.id)).
   leftJoin(user,eq(asset.userId,user.id)).where(eq(asset.id,assetId))
    
   return result;

  } catch (error) {
    console.log(error)
    return null;

  }

}