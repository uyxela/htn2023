import { useEffect, useState } from "react";
import { getPageTitle } from "./utils";
import axios from "axios";

function App() {
  const [productName, setProductName] = useState("Loading...");
  const [productBrand, setProductBrand] = useState("Loading...");

  const [reviewObj, setReviewObj] = useState<string | any>("Loading...");

  useEffect(() => {
    (async function getProductInfo() {
      const pageTitle = await getPageTitle();

      if (!pageTitle) {
        return;
      }

      const response = await axios.get(
        `http://localhost:9000/product-details?title=${pageTitle}`
      );

      console.log(response);

      const reviewResponse = await axios.get(
        `http://localhost:9000/review-summary?productName=${response.data.productName}&brandName=${response.data.brandName}`
      );

      console.log(reviewResponse.data);

      setProductName(response.data.productName);
      setProductBrand(response.data.brandName);
      setReviewObj(reviewResponse.data);
    })();
  }, []);

  return (
    <div>
      <p>{productName}</p>
      <p>{productBrand}</p>
      <p>{typeof reviewObj === "string" ? reviewObj : reviewObj.text}</p>
      <ul>
        {typeof reviewObj !== "string" &&
          reviewObj.documents.map((doc: any, index: number) => (
            <li key={index}>{doc.url}</li>
          ))}
      </ul>
    </div>
  );
}

export default App;
