"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { asset, category } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
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
