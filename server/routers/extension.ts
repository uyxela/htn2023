import {
  getBrandName,
  getProductName,
  getSummaryKeywords,
  getSummarySentiment,
  getReviewSummary,
} from "backend/utils/cohere";
import prisma from "backend/utils/prisma";
import { generateUuid } from "backend/utils/uuid";
import { Router } from "express";

const extensionRouter = Router();

extensionRouter.get("/product", async (req, res) => {
  const productName = req.query.productName;
  const brandName = req.query.brandName;

  if (typeof productName !== "string" || typeof brandName !== "string") {
    res.status(400).send("Invalid product or brand name");
    return;
  }

  const product = await prisma.product.findUnique({
    where: {
      name_brand: {
        name: productName,
        brand: brandName,
      },
    },
    include: {
      reviews: true,
    },
  });

  if (!product) {
    res.status(404).send("Product not found");
    return;
  }

  res.json(product);
});

extensionRouter.get("/product-details", async (req, res) => {
  const title = req.query.title;

  if (typeof title !== "string") {
    res.status(400).send("Invalid title");
    return;
  }

  const [productName, brandName] = await Promise.all([
    getProductName(title),
    getBrandName(title),
  ]);

  res.json({
    productName: productName?.trim(),
    brandName: brandName?.trim(),
  });
});

extensionRouter.get("/review-summary", async (req, res) => {
  const productName = req.query.productName;
  const brandName = req.query.brandName;

  if (typeof productName !== "string" || typeof brandName !== "string") {
    res.status(400).send("Invalid product or brand name");
    return;
  }

  const response = await getReviewSummary(productName, brandName);

  res.json(response);
});

extensionRouter.get("/summary-keywords", async (req, res) => {
  const summary = req.query.summary;

  if (typeof summary !== "string") {
    res.status(400).send("Invalid summary");
    return;
  }

  const keywords = await getSummaryKeywords(summary);

  res.json(keywords.slice(2, 5));
});

extensionRouter.get("/summary-sentiment", async (req, res) => {
  const summary = req.query.summary;

  if (typeof summary !== "string") {
    res.status(400).send("Invalid summary");
    return;
  }

  const sentiment = await getSummarySentiment(summary);

  res.json(sentiment);
});

extensionRouter.post("/save-product", async (req, res) => {
  const {
    productName,
    brandName,
    summary,
    reviews,
    keywords,
    sentiment,
  }: {
    productName: string;
    brandName: string;
    summary: string;
    reviews: {
      id: string;
      snippet: string;
      title: string;
      url: string;
    }[];
    sentiment: string;
    keywords: string[];
  } = req.body;

  const existingProduct = await prisma.product.findUnique({
    where: {
      name_brand: {
        name: productName,
        brand: brandName,
      },
    },
  });

  if (existingProduct) {
    res.status(400).send({ error: "Product already exists" });
    return;
  }

  const savedProduct = await prisma.product.create({
    data: {
      id: generateUuid(),
      name: productName,
      brand: brandName,
      summary,
      sentiment,
      keywords,
    },
  });

  const savedReviews = await Promise.all(
    reviews.map(
      async (review) =>
        await prisma.review.create({
          data: {
            id: generateUuid(),
            snippet: review.snippet,
            title: review.title,
            link: review.url,
            productId: savedProduct.id,
          },
        })
    )
  );

  res.status(200).json({
    product: savedProduct,
    reviews: savedReviews,
  });
});

export default extensionRouter;
