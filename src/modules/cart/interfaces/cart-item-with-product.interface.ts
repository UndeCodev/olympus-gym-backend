export interface CartItemWithProduct {
  id:        number;
  cartId:    number;
  productId: number;
  price:     number;
  quantity:  number;
  name:      string;
  category:  string;
  product:   Product;
}

export interface Product {
  id:          number;
  name:        string;
  description: string;
  price:       number;
  categoryId:  number;
  stock:       number;
  status:      string;
  createdAt:   Date;
  updatedAt:   Date;
}
