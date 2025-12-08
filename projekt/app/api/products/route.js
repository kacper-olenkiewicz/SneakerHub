import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import defaultProducts from '../../../lib/defaultProducts';

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' }
    });
    const responsePayload = [...products, ...defaultProducts];
    return NextResponse.json(responsePayload);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, price, category, image, description = "", stock } = body;

    if (!name || !price || !category) {
      return NextResponse.json(
        { error: 'Name, price and category are required' },
        { status: 400 }
      );
    }

    const product = await prisma.product.create({
      data: {
        name,
        price: Number(price),
        category: category.toLowerCase(),
        image,
        description: description || `${name} - ${category}`,
        stock: Number.isFinite(Number(stock)) ? Number(stock) : 0
      }
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error('Products POST error:', error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const idParam = searchParams.get('id');

    if (!idParam || !Number.isFinite(Number(idParam))) {
      return NextResponse.json({ error: 'Product id is required' }, { status: 400 });
    }

    await prisma.product.delete({ where: { id: Number(idParam) } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Products DELETE error:', error);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
