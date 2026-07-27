"use server"

import { db } from "@/lib/db"
import { categories, branches, products, slides } from "@/lib/db/schema"
import { asc, eq, and } from "drizzle-orm"

export async function getCategories() {
  return db.select().from(categories).orderBy(asc(categories.sortOrder), asc(categories.id))
}

export async function getBranches() {
  return db.select().from(branches).orderBy(asc(branches.sortOrder), asc(branches.id))
}

export async function getBranchesByCategory(categoryId: number) {
  return db
    .select()
    .from(branches)
    .where(eq(branches.categoryId, categoryId))
    .orderBy(asc(branches.sortOrder), asc(branches.id))
}

export async function getProducts() {
  return db
    .select()
    .from(products)
    .where(eq(products.isActive, true))
    .orderBy(asc(products.sortOrder), asc(products.id))
}

export async function getAllProducts() {
  return db.select().from(products).orderBy(asc(products.sortOrder), asc(products.id))
}

export async function getProductsByCategory(categoryId: number) {
  return db
    .select()
    .from(products)
    .where(and(eq(products.isActive, true), eq(products.categoryId, categoryId)))
    .orderBy(asc(products.sortOrder), asc(products.id))
}

export async function getProductsByBranch(branchId: number) {
  return db
    .select()
    .from(products)
    .where(and(eq(products.isActive, true), eq(products.branchId, branchId)))
    .orderBy(asc(products.sortOrder), asc(products.id))
}

export async function getProduct(id: number) {
  const rows = await db.select().from(products).where(eq(products.id, id)).limit(1)
  return rows[0] ?? null
}

export async function getSlides() {
  return db
    .select()
    .from(slides)
    .where(eq(slides.isActive, true))
    .orderBy(asc(slides.sortOrder), asc(slides.id))
}

export type Category = Awaited<ReturnType<typeof getCategories>>[number]
export type Branch = Awaited<ReturnType<typeof getBranches>>[number]
export type Product = Awaited<ReturnType<typeof getProducts>>[number]
export type Slide = Awaited<ReturnType<typeof getSlides>>[number]
