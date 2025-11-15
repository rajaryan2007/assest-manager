"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { asset, invoice, payment, purchase, user } from "@/lib/db/schema";
import { generateInvoiceHtml } from "@/lib/invoice/invoice-html-genrator";
import { error, log } from "console";
import { eq } from "drizzle-orm";
import { BedDouble } from "lucide-react";
import { headers } from "next/headers";
import { success } from "zod";
import { v4 as uuidv4 } from "uuid";
import { revalidatePath } from "next/cache";

export async function createInvoiceAction(purchaseId: string) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session?.user.id) {
      return {
        success: false,
        error: "NOT authenticated",
      };
    }
    const [purchaseData] = await db
      .select({
        purchase: purchase,
        asset: asset,
        payment: payment,
        user: user,
      })
      .from(purchase)
      .innerJoin(asset, eq(purchase.assetId, asset.id))
      .innerJoin(payment, eq(purchase.paymentId, payment.id))
      .innerJoin(user, eq(purchase.userId, user.id))
      .where(eq(purchase.id, purchaseId))
      .limit(1);

    if (!purchaseData) {
      return {
        success: false,
        error: "Purchase not found",
      };
    }

    if (
      purchaseData.purchase.userId !== session.user.id &&
      session.user.role !== "admin"
    ) {
      return {
        success: false,
        error: "Not authorized",
      };
    }

    const invoiceNumber = `INV - ${new Date().getFullYear()}${(
      new Date().getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}-
      ${Math.floor(1000 + Math.random() * 9000)}`;

    const htmlContent = generateInvoiceHtml(
      invoiceNumber,
      new Date(purchaseData.purchase.createdAt).toISOString(),
      purchaseData.asset.title,
      purchaseData.purchase.price
    );

    const [newInvoice] = await db
      .insert(invoice)
      .values({
        id: uuidv4(),
        invoiceNumber,
        purchaseId: purchaseData.purchase.id,
        userId: purchaseData.user.id,
        amount: purchaseData.purchase.price,
        currency: "USD",
        status: "paid",
        htmlContent,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    revalidatePath("/dashboard/purchases");

    return {
      success: true,
      invoiceId: newInvoice.id,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "failed to create invoice",
    };
  }
}

export async function getUserInvoiceAction() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session?.user.id) {
      return {
        success: false,
        error: "Not authenticated",
      };
    }
    const userInvoices = await db
      .select()
      .from(invoice)
      .where(eq(invoice.userId, session.user.id))
      .orderBy(invoice.createdAt);

    return {
      success: true,
      invoice: userInvoices,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "failed to generate user invoice",
    };
  }
}

export async function getInvoicehtmlAction(invoiceId: string) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session?.user.id) {
      return {
        success: false,
        error: "Not authenticated",
      };
    }

    const [invoiceData] = await db
      .select()
      .from(invoice)
      .where(eq(invoice.id, invoiceId))
      .limit(1);

    if (!invoiceData) {
      return {
        success: false,
        error: "invoice not found",
      };
    }
    if (
      invoiceData.userId !== session.user.id &&
      session.user.role !== "admin"
    ) {
      return {
        success: false,
        error: "Not authorized",
      };
    }

    if (!invoiceData.htmlContent) {
      return {
        success: false,
        error: "invoice html content not found",
      };
    }

    return {
      success: true,
      html: invoiceData.htmlContent,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "failed to get invoice",
    };
  }
}

export async function getInvoiceByIdAction(invoiceId: string) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session?.user.id) {
      return {
        success: false,
        error: "Not authenticated",
      };
    }

    const [invoiceData] = await db
      .select()
      .from(invoice)
      .where(eq(invoice.id, invoiceId))
      .limit(1);

    if (!invoiceData) {
      return {
        success: false,
        error: "invoice not found",
      };
    }
    if (
      invoiceData.userId !== session.user.id &&
      session.user.role !== "admin"
    ) {
      return {
        success: false,
        error: "Not authorized",
      };
    }

    if (!invoiceData.htmlContent) {
      return {
        success: false,
        error: "invoice html content not found",
      };
    }

    return {
      success: true,
      html: invoiceData.htmlContent,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "failed to get invoice",
    };
  }
}
