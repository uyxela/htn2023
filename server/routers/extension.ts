import {
  getBrandName,
  getProductName,
  getSummaryKeywords,
  summarizeProductReviews,
} from "backend/utils/cohere";
import { Router } from "express";

const extensionRouter = Router();

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

  const { data } = await summarizeProductReviews(productName, brandName);

  res.json(data);
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

export default extensionRouter;
