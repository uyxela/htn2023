import { tokenAuthenticator } from "backend/middleware";
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

extensionRouter.get("/bookmarks", tokenAuthenticator, async (req, res) => {
  if (!req.user) {
    res.status(401).send("Unauthorized");
    return;
  }

  const user = await prisma.user.findUnique({
    where: {
      id: req.user.id,
    },
    include: {
      savedProducts: true,
    },
  });

  res.json(user?.savedProducts ?? []);
});

extensionRouter.post("/bookmarks", tokenAuthenticator, async (req, res) => {
  if (!req.user) {
    res.status(401).send("Unauthorized");
    return;
  }

  try {
    await prisma.user.update({
      where: {
        id: req.user.id,
      },
      data: {
        savedProducts: {
          connect: {
            id: req.body.productId,
          },
        },
      },
    });

    const product = await prisma.product.findUnique({
      where: {
        id: req.body.productId,
      },
    });

    res.json(product);
  } catch (error: unknown) {
    console.log(error);
    res.sendStatus(400);
  }
});

extensionRouter.delete("/bookmarks", tokenAuthenticator, async (req, res) => {
  if (!req.user) {
    res.status(401).send("Unauthorized");
    return;
  }

  if (typeof req.query.productId !== "string") {
    res.status(400).send("Missing product ID");
    return;
  }

  try {
    await prisma.user.update({
      where: {
        id: req.user.id,
      },
      data: {
        savedProducts: {
          disconnect: {
            id: req.query.productId,
          },
        },
      },
    });

    res.sendStatus(200);
  } catch (error: unknown) {
    console.log(error);
    res.sendStatus(400);
  }
});

extensionRouter.get("/search", async (req, res) => {
  const q = req.query.q;

  if (typeof q !== "string") {
    res.status(400).send("Invalid query");
    return;
  }

  const products = await prisma.product.findMany({
    where: {
      OR: [
        {
          name: {
            contains: q,
            mode: "insensitive",
          },
        },
        {
          brand: {
            contains: q,
            mode: "insensitive",
          },
        },
        {
          keywords: {
            has: q.toLowerCase(),
          },
        },
      ],
    },
    include: {
      users: true,
    },
  });

  res.json(products);
});

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

  const titleRecord = await prisma.title.findUnique({
    where: {
      title,
    },
  });

  if (titleRecord) {
    res.json({
      productName: titleRecord.name,
      brandName: titleRecord.brand,
    });
    return;
  }

  const [productName, brandName] = await Promise.all([
    getProductName(title),
    getBrandName(title),
  ]);

  if (productName && brandName) {
    await prisma.title.create({
      data: {
        title,
        name: productName.trim(),
        brand: brandName.trim(),
      },
    });
  }

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

  const filteredKeywords = keywords.filter((keyword) => keyword.length > 4);

  res.json(filteredKeywords.slice(2, 5));
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

extensionRouter.get("/likes", tokenAuthenticator, async (req, res) => {
  if (!req.user) {
    res.status(401).send("Unauthorized");
    return;
  }

  const user = await prisma.user.findUnique({
    where: {
      id: req.user.id,
    },
    include: {
      likes: true,
    },
  });

  res.json(user?.likes ?? []);
});

extensionRouter.post("/likes", tokenAuthenticator, async (req, res) => {
  if (!req.user) {
    res.status(401).send("Unauthorized");
    return;
  }

  try {
    await prisma.user.update({
      where: {
        id: req.user.id,
      },
      data: {
        likes: {
          connect: {
            id: req.body.documentId,
          },
        },
      },
    });

    const document = await prisma.review.findUnique({
      where: {
        id: req.body.documentId,
      },
    });

    res.json(document);
  } catch (error: unknown) {
    console.log(error);
    res.sendStatus(400);
  }
});

extensionRouter.delete("/likes", tokenAuthenticator, async (req, res) => {
  if (!req.user) {
    res.status(401).send("Unauthorized");
    return;
  }

  if (typeof req.query.documentId !== "string") {
    res.status(400).send("Missing document ID");
    return;
  }

  try {
    await prisma.user.update({
      where: {
        id: req.user.id,
      },
      data: {
        likes: {
          disconnect: {
            id: req.query.documentId,
          },
        },
      },
    });

    res.sendStatus(200);
  } catch (error: unknown) {
    console.log(error);
    res.sendStatus(400);
  }
});

export default extensionRouter;
