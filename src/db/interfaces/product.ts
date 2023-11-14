import { Document } from "mongoose";

interface Product extends Document {
  name: string;
  description: string;
  brand: string;
  productId?: string
  price: number;
  stock: number;
  imageUrl: string;
  userId: string;
  category: string;
}

export default Product;
