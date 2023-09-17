import puppeteer from "puppeteer";

export const getGoogleSearchResults = async (searchQuery: string) => {
  const browser = await puppeteer.launch({
    headless: true,
  });
  const [page] = await browser.pages();

  if (!page) return;

  await page.setRequestInterception(true);
  await page.setExtraHTTPHeaders({
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.84 Safari/537.36 Agency/97.8.6287.88",
  });

  page.on("request", (request) => {
    request.resourceType() === "document"
      ? request.continue()
      : request.abort();
  });

  await page.goto(
    `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`,
    { waitUntil: "domcontentloaded" }
  );

  // await page.waitForSelector('input[aria-label="Google Search"]', {
  //   visible: true,
  // });
  // await page.type('input[aria-label="Google Search"]', searchQuery);

  // await Promise.all([
  //   page.waitForNavigation({ waitUntil: "domcontentloaded" }),
  //   page.keyboard.press("Enter"),
  // ]);

  await page.waitForSelector(".LC20lb", { visible: true });

  const pageTitles = await page.$$eval(".DKV0Md", (els) => {
    return els.map((e: any) => e.innerText);
  });
  const pageLinks = await page.$$eval(".yuRUbf a", (els) => {
    return els.map((e: any) => e.href);
  });
  const pageDescriptions = await page.$$eval(".lEBKkf span", (els) => {
    return els
      .filter((e: any) => e.innerText.length > 21)
      .map((e: any) => e.innerText);
  });

  const searchResults: any[] = [];

  for (let i = 0; i < pageTitles.length; i++) {
    searchResults.push({
      title: pageTitles[i],
      link: pageLinks[i],
      description: pageDescriptions[i],
    });
  }

  await browser.close();
  return searchResults;
};
