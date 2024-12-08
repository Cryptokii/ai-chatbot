import type { NextApiRequest, NextApiResponse } from 'next/types';
import { connectToDatabase } from '../../../utils/mongodb';
import { ObjectId } from 'mongodb';
import { upload } from '../../../utils/upload';
import { Request } from 'express';
import fs from 'fs';
import path from 'path';

interface MulterRequest extends Request {
  file?: Express.Multer.File;
  files?: Express.Multer.File[];
  query: {
    [key: string]: string | string[];
  };
  method: string;
  body: {
    name: string;
    description: string;
    price: string;
    category: string;
    stockQuantity: string;
    sizes: string;
    colors: string;
    [key: string]: string;
  };
}

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: MulterRequest,
  res: NextApiResponse
) {
  try {
    const id = req.query.id as string;
    const { db } = await connectToDatabase();
    const collection = db.collection('products');
    const objectId = new ObjectId(id);

    switch (req.method) {
      case 'GET':
        const product = await collection.findOne({ _id: objectId });
        if (!product) {
          return res.status(404).json({ message: 'Product not found' });
        }
        return res.status(200).json(product);

      case 'PUT':
        const existingProduct = await collection.findOne({ _id: objectId });
        if (!existingProduct) {
          return res.status(404).json({ message: 'Product not found' });
        }

        await new Promise((resolve, reject) => {
          upload.array('images', 4)(req as any, res as any, (err: any) => {
            if (err) reject(err);
            resolve(true);
          });
        });

        let imageUrls = existingProduct.images || [];

        if (req.files && req.files.length > 0) {
          // Delete old images
          existingProduct.images.forEach((imageUrl: string) => {
            const imagePath = path.join(process.cwd(), 'public', imageUrl);
            if (fs.existsSync(imagePath)) {
              fs.unlinkSync(imagePath);
            }
          });

          // Add new images
          imageUrls = req.files.map(file => `/uploads/${file.filename}`);
        }

        const updateData = {
          name: req.body.name,
          description: req.body.description,
          images: imageUrls,
          price: parseFloat(req.body.price),
          stock: parseInt(req.body.stockQuantity),
          category: req.body.category,
          sizes: JSON.parse(req.body.sizes),
          colors: JSON.parse(req.body.colors),
          updatedAt: new Date(),
        };

        await collection.updateOne(
          { _id: objectId },
          { $set: updateData }
        );

        return res.status(200).json({
          ...updateData,
          _id: id,
        });

      case 'DELETE':
        const productToDelete = await collection.findOne({ _id: objectId });
        if (!productToDelete) {
          return res.status(404).json({ message: 'Product not found' });
        }

        // Delete associated images
        productToDelete.images.forEach((imageUrl: string) => {
          const imagePath = path.join(process.cwd(), 'public', imageUrl);
          if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
          }
        });

        await collection.deleteOne({ _id: objectId });
        return res.status(204).end();

      default:
        res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('Error processing request:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}
