import type { NextApiRequest, NextApiResponse } from 'next/types';
import { connectToDatabase } from '../../../utils/mongodb';
import { upload } from '../../../utils/upload';
import { Request } from 'express';

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
    const { db } = await connectToDatabase();
    const collection = db.collection('products');

    switch (req.method) {
      case 'GET':
        const { category } = req.query;
        const query = category ? { category } : {};
        const products = await collection.find(query).toArray();
        return res.status(200).json(products);

      case 'POST':
        await new Promise((resolve, reject) => {
          upload.array('images', 4)(req as any, res as any, (err: any) => {
            if (err) reject(err);
            resolve(true);
          });
        });

        if (!req.files) {
          return res.status(400).json({ message: 'No files uploaded' });
        }

        const imageUrls = req.files.map(file => `/uploads/${file.filename}`);

        const productData = {
          name: req.body.name,
          description: req.body.description,
          images: imageUrls,
          price: parseFloat(req.body.price),
          stock: parseInt(req.body.stockQuantity),
          category: req.body.category,
          sizes: JSON.parse(req.body.sizes),
          colors: JSON.parse(req.body.colors),
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        const insertResult = await collection.insertOne(productData);
        return res.status(201).json({
          ...productData,
          _id: insertResult.insertedId,
        });

      default:
        res.setHeader('Allow', ['GET', 'POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('Error processing request:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}
