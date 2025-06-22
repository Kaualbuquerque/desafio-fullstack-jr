// src/utils/discount.ts

export type DiscountType = 'percent' | 'fixed';

export interface DiscountOptions {
  type: DiscountType;
  value: number;
}

export function applyDiscountUtil(originalPrice: number, options: DiscountOptions): number {
  const { type, value } = options;

  if (type === 'percent') {
    // Valida desconto percentual: entre 1% e 100%
    if (value <= 0 || value > 100) {
      throw new Error('Desconto percentual inválido.');
    }
    const discount = (originalPrice * value) / 100;
    const finalPrice = originalPrice - discount;
    if (finalPrice < 0.01) {
      throw new Error('Preço final muito baixo após desconto percentual.');
    }
    return Math.round(finalPrice * 100) / 100;
  }

  if (type === 'fixed') {
    // Valida desconto fixo: maior que zero e menor que o próprio preço
    if (value <= 0) {
      throw new Error('Valor de desconto fixo inválido.');
    }
    const finalPrice = originalPrice - value;
    if (finalPrice < 0.01) {
      throw new Error('Preço final muito baixo após desconto fixo.');
    }
    return Math.round(finalPrice * 100) / 100;
  }

  throw new Error('Tipo de desconto desconhecido.');
}
