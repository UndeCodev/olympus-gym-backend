import { PrismaClient } from '../../../../generated/prisma';
import { loadRules } from './getProductRecommendations.service';

const prisma = new PrismaClient();

export const getCartRecommendationsService = async (products: string[], top_n: number = 5) => {
  const recommendations: { name: string; lift: number; confidence: number }[] = [];
  const productNames = new Set<string>();

  const rules = loadRules();

  for (const product of products) {
    const filteredRules = rules
      .filter((rule) => rule.antecedents.includes(product))
      .sort((a, b) => {
        if (b.lift !== a.lift) return b.lift - a.lift;
        return b.confidence - a.confidence;
      });

    for (const rule of filteredRules) {
      for (const item of rule.consequents) {
        if (!products.includes(item) && !productNames.has(item)) {
          recommendations.push({ name: item, lift: rule.lift, confidence: rule.confidence });
          productNames.add(item);
          if (recommendations.length >= top_n) break;
        }
      }
      if (recommendations.length >= top_n) break;
    }

    if (recommendations.length >= top_n) break;
  }

  if (recommendations.length === 0 && products.length > 0) {
    const original = await prisma.product.findUnique({
      where: { name: products[0] },
      select: { categoryId: true },
    });

    if (original) {
      return prisma.product.findMany({
        where: {
          categoryId: original.categoryId,
          name: { notIn: products },
        },
        take: 8,
        include: {
          images: {
            select: { url: true },
            where: { isPrimary: true },
            take: 1,
          },
          category: {
            select: {
              name: true,
            },
          },
        },
        omit: {
          categoryId: true,
          brandId: true,
          presentationId: true,
          status: true,
          stock: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    }

    return [];
  }

  const productsDB = await prisma.product.findMany({
    where: {
      name: { in: recommendations.map((r) => r.name) },
    },
    include: {
      images: {
        select: { url: true },
        where: { isPrimary: true },
        take: 1,
      },
      category: {
        select: {
          name: true,
        },
      },
    },
    omit: {
      categoryId: true,
      brandId: true,
      presentationId: true,
      status: true,
      stock: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  const orderedProducts = recommendations.map((r) => {
    const p = productsDB.find((prod) => prod.name === r.name);
    return { ...p, lift: r.lift, confidence: r.confidence };
  });

  return orderedProducts;
};
