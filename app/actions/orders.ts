"use server"

import { db } from "@/lib/db"
import { orders, orderItems } from "@/lib/db/schema"
import { getUserId } from "@/lib/session"
import { and, desc, eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"

export type CartLine = {
  productId: number
  productName: string
  material: string
  unitPrice: number
  quantity: number
}

export type CheckoutInput = {
  customerName: string
  customerPhone: string
  customerAddress: string
  note: string
  items: CartLine[]
}

export async function placeOrder(input: CheckoutInput) {
  const userId = await getUserId()

  if (!input.items.length) throw new Error("سەبەتە بەتاڵە")
  if (!input.customerName.trim() || !input.customerPhone.trim()) {
    throw new Error("تکایە ناو و ژمارەی مۆبایل بنووسە")
  }

  const total = input.items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0)

  const [order] = await db
    .insert(orders)
    .values({
      userId,
      customerName: input.customerName.trim(),
      customerPhone: input.customerPhone.trim(),
      customerAddress: input.customerAddress.trim(),
      note: input.note.trim(),
      total,
      status: "pending",
    })
    .returning({ id: orders.id })

  await db.insert(orderItems).values(
    input.items.map((i) => ({
      orderId: order.id,
      productId: i.productId,
      productName: i.productName,
      material: i.material,
      unitPrice: i.unitPrice,
      quantity: i.quantity,
    })),
  )

  revalidatePath("/orders")
  revalidatePath("/admin/orders")
  return { orderId: order.id }
}

export async function getMyOrders() {
  const userId = await getUserId()
  const myOrders = await db
    .select()
    .from(orders)
    .where(eq(orders.userId, userId))
    .orderBy(desc(orders.createdAt))

  const result = []
  for (const o of myOrders) {
    const items = await db
      .select()
      .from(orderItems)
      .where(eq(orderItems.orderId, o.id))
    result.push({ ...o, items })
  }
  return result
}

export async function cancelMyOrder(orderId: number) {
  const userId = await getUserId()
  await db
    .update(orders)
    .set({ status: "cancelled" })
    .where(and(eq(orders.id, orderId), eq(orders.userId, userId), eq(orders.status, "pending")))
  revalidatePath("/orders")
  revalidatePath("/admin/orders")
}
