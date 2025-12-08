import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userIdParam = searchParams.get('userId');

    const parsedUserId = userIdParam ? Number.parseInt(userIdParam, 10) : null;
    const where = Number.isFinite(parsedUserId) && parsedUserId !== null
      ? { userId: parsedUserId }
      : undefined;

    const orders = await prisma.order.findMany({
      where,
      include: {
        user: true,
        orderItems: true
      },
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(orders);
  } catch (error) {
    console.error('Orders GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { userId, items } = body;

    if (!userId || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Invalid order payload' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const total = items.reduce((sum, item) => {
      const price = Number(item.price) || 0;
      const quantity = Number(item.quantity) || 1;
      return sum + price * quantity;
    }, 0);

    const candidateProductIds = Array.from(
      new Set(
        items
          .map((item) => Number(item.productId))
          .filter((id) => Number.isFinite(id))
      )
    );

    const existingProducts = candidateProductIds.length
      ? await prisma.product.findMany({
          where: { id: { in: candidateProductIds } },
          select: { id: true }
        })
      : [];

    const validProductIds = new Set(existingProducts.map((product) => product.id));

    const order = await prisma.order.create({
      data: {
        userId,
        total,
        status: 'PENDING',
        orderItems: {
          create: items.map((item) => ({
            ...(Number.isFinite(Number(item.productId)) && validProductIds.has(Number(item.productId))
              ? { productId: Number(item.productId) }
              : {}),
            quantity: Number(item.quantity) || 1,
            priceAtPurchase: Number(item.price) || 0,
            productName: item.name ?? 'Unknown product',
            productImage: item.image ?? null
          }))
        }
      },
      include: {
        user: true,
        orderItems: true
      }
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error('Orders POST error:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const idParam = searchParams.get('id');

    if (!idParam || !Number.isFinite(Number(idParam))) {
      return NextResponse.json({ error: 'Order id is required' }, { status: 400 });
    }

    await prisma.order.delete({ where: { id: Number(idParam) } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Orders DELETE error:', error);
    return NextResponse.json({ error: 'Failed to delete order' }, { status: 500 });
  }
}
