"use server"

import { db } from "@/lib/db"
import { favorites, products } from "@/lib/db/schema"
import { getUserId } from "@/lib/session"
import { and, eq, desc } from "drizzle-orm"
import { revalidatePath } from "next/cache"

export async function getFavoriteIds() {
  const userId = await getUserId()
  const rows = await db
    .select({ productId: favorites.productId })
    .from(favorites)
    .where(eq(favorites.userId, userId))
  return rows.map((r) => r.productId)
}

export async function getFavoriteProducts() {
  const userId = await getUserId()
  return db
    .select({
      id: products.id,
      name: products.name,
      description: products.description,
      image: products.image,
      categoryId: products.categoryId,
      branchId: products.branchId,
      priceOriginal: products.priceOriginal,
      priceMedium: products.priceMedium,
      priceNormal: products.priceNormal,
      isActive: products.isActive,
      sortOrder: products.sortOrder,
      createdAt: products.createdAt,
    })
    .from(favorites)
    .innerJoin(products, eq(favorites.productId, products.id))
    .where(eq(favorites.userId, userId))
    .orderBy(desc(favorites.createdAt))
}

export async function toggleFavorite(productId: number) {
  const userId = await getUserId()
  const existing = await db
    .select()
    .from(favorites)
    .where(and(eq(favorites.userId, userId), eq(favorites.productId, productId)))
    .limit(1)

  if (existing.length > 0) {
    await db
      .delete(favorites)
      .where(and(eq(favorites.userId, userId), eq(favorites.productId, productId)))
    revalidatePath("/")
    revalidatePath("/favorites")
    return { favorited: false }
  }

  await db.insert(favorites).values({ userId, productId })
  revalidatePath("/")
  revalidatePath("/favorites")
  return { favorited: true }
}
