import path from 'node:path';
import fs from 'node:fs';

import { AssociationRule } from '../interfaces/assocationRule.interface';
import { ProductModel } from '../models/product.model';

export const loadRules = (): AssociationRule[] => {
  try {
    const rulesPath = path.resolve(process.cwd(), 'src', 'modules', 'product', 'data', 'reglas_asociacion.json');

    console.log({ rulesPath });

    const rawData = fs.readFileSync(rulesPath, 'utf-8');

    return JSON.parse(rawData);
  } catch {
    return [];
  }
};

export const getProductRecommendationsService = async (productName: string, top_n: number = 5 ) => {
  const recommendations = new Set<string>();

  const rules = loadRules()
  
  const filteredRules = rules
    .filter((rule) => rule.antecedents.includes(productName))
    .sort((a, b) => {
      if (b.lift !== a.lift) return b.lift - a.lift;
      return b.confidence - a.confidence;
    });

  for (const rule of filteredRules) {
    for (const item of rule.consequents) {
      if (item !== productName && !recommendations.has(item)) {
        recommendations.add(item);
        if (recommendations.size >= top_n) break;
      }
    }
    if (recommendations.size >= top_n) break;
  }

  const recommendationsProducts  = await ProductModel.getProductRecommendations(productName, recommendations, top_n);

  return recommendationsProducts;
};
