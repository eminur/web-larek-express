import mongoose from "mongoose";

interface IImage {
  fileName: string;
  originalName: string;
}

interface IProduct {
  description: string;
  image: IImage;
  title: string;
  category: string;
  price: number;
}

const imageSchema = new mongoose.Schema<IImage>({
  fileName: {
    type: String,
    required: true,
  },
  originalName: {
    type: String,
    required: true,
  },
});

const productSchema = new mongoose.Schema<IProduct>({
  description: {
    type: String,
  },
  image: imageSchema,
  title: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    default: null,
  },
});

export default mongoose.model<IProduct>("Product", productSchema);
