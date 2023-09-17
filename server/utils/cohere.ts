import axios from "axios";
import cohere from "cohere-ai";

const COHERE_CHAT_URL = "https://api.cohere.ai/v1/chat";

cohere.init(process.env.COHERE_API_KEY!);

export async function getProductName(title: string) {
  console.log(`Extracting product name from ${title}`);

  let productName: string | undefined = "";

  try {
    const response = await cohere.generate({
      model: "command",
      prompt: `extract only the product name from the title:${title}`,
      max_tokens: 400,
      temperature: 0,
      k: 0,
      p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
      stop_sequences: [],
      return_likelihoods: "NONE",
    });

    productName = response.body.generations[0]?.text;
  } catch (error: unknown) {
    console.log(error);
  }

  return productName;
}

export async function getBrandName(title: string) {
  console.log(`Extracting brand name from ${title}`);

  let brandName: string | undefined = "";

  try {
    const response = await cohere.generate({
      model: "command",
      prompt: `extract only the brand name from the title:${title}`,
      max_tokens: 400,
      temperature: 0,
      k: 0,
      p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
      stop_sequences: [],
      return_likelihoods: "NONE",
    });

    brandName = response.body.generations[0]?.text;
  } catch (error: unknown) {
    console.log(error);
  }

  return brandName;
}

export async function getReviewSummary(productName: string, brandName: string) {
  console.log(`Summarizing reviews for the ${productName} by ${brandName}`);

  let response: any;

  try {
    response = await axios.post(
      COHERE_CHAT_URL,
      {
        message: `Summarize reviews for the ${productName} by ${brandName}`,
        model: "command-nightly",
        connectors: [
          {
            id: "web-search",
          },
        ],
        temperature: 0,
        stream: false,
        prompt_truncation: "AUTO",
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.COHERE_API_KEY}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error: unknown) {
    console.log(error);
  }

  const titleSet = new Set<string>();

  response.data.documents.forEach((document: any) => {
    titleSet.add(document.title);
  });

  const filteredReviews = Array.from(titleSet).map((title) =>
    response.data.documents.find((document: any) => document.title === title)
  );

  const linkSet = new Set<string>();

  filteredReviews.forEach((review) => {
    linkSet.add(review.url);
  });

  const finalFilteredReviews = Array.from(linkSet).map((link) =>
    filteredReviews.find((review) => review.url === link)
  );

  const formattedResponse = {
    summary: response.data.text,
    reviews: finalFilteredReviews,
  };

  return formattedResponse;
}

export async function getSummaryKeywords(summary: string) {
  let keywords: string[] | undefined;

  try {
    const response = await cohere.generate({
      prompt: `give a comma-separated list of keywords from this:${summary}`,
      model: "command",
      max_tokens: 300,
      temperature: 0,
    });

    keywords = response.body.generations[0]?.text
      .split(",")
      .map((keyword) => keyword.trim());
  } catch (error: unknown) {
    console.log(error);
  }

  return keywords ?? [];
}

export async function getSummarySentiment(summary: string) {
  let sentiment: string | undefined;

  try {
    const response = await cohere.classify({
      model: "embed-english-v2.0",
      inputs: [summary],
      examples: [
        { text: "The order came 5 days early", label: "positive" },
        { text: "The item exceeded my expectations", label: "positive" },
        { text: "I ordered more for my friends", label: "positive" },
        { text: "I would buy this again", label: "positive" },
        { text: "I would recommend this to others", label: "positive" },
        { text: "This product isn't bad at all", label: "positive" },
        { text: "The product was surprisingly decent", label: "positive" },
        { text: "It wasn't terrible.", label: "neutral" },
        { text: "The item wasn't too shabby.", label: "positive" },
        { text: "It's not as bad as I expected.", label: "neutral" },
        { text: "The quality is better than I thought.", label: "positive" },
        { text: "It didn't disappoint me.", label: "positive" },
        { text: "It's not awful.", label: "neutral" },
        { text: "The product is somewhat satisfactory.", label: "neutral" },
        { text: "I'm pleasantly surprised by it.", label: "positive" },
        { text: "It's not a complete letdown.", label: "neutral" },
        { text: "The package was damaged", label: "negative" },
        { text: "The order is 5 days late", label: "negative" },
        { text: "The order was incorrect", label: "negative" },
        { text: "I want to return my item", label: "negative" },
        { text: "The item's material feels low quality", label: "negative" },
        { text: "The product was okay", label: "neutral" },
        { text: "I received five items in total", label: "neutral" },
        { text: "I bought it from the website", label: "neutral" },
        { text: "I used the product this morning", label: "neutral" },
        { text: "The product arrived yesterday", label: "neutral" },
        { text: "reviewText", label: "positive" },
        { text: "No issues.", label: "positive" },
        {
          text: "Purchased this for my device, it worked as advertised. You can never have too much phone memory, since I download a lot of stuff this was a no brainer for me.",
          label: "positive",
        },
        {
          text: "it works as expected. I should have sprung for the higher capacity.  I think its made a bit cheesier than the earlier versions; the paint looks not as clean as before",
          label: "positive",
        },
        {
          text: "This think has worked out great.Had a diff. bran 64gb card and if went south after 3 months.This one has held up pretty well since I had my S3, now on my Note3.*** update 3/21/14I've had this for a few months and have had ZERO issue's since it was transferred from my S3 to my Note3 and into a note2. This card is reliable and solid!Cheers!",
          label: "positive",
        },
        {
          text: "Bought it with Retail Packaging, arrived legit, in a orange envelope, english version not asian like the picture shows. arrived quickly, bought a 32 and 16 both retail packaging for my htc one sv and Lg Optimus, both cards in working order, probably best price you'll get for a nice sd card",
          label: "positive",
        },
        {
          text: "It's mini storage.  It doesn't do anything else and it's not supposed to.  I purchased it to add additional storage to my Microsoft Surface Pro tablet which only come in 64 and 128 GB.  It does what it's supposed to and SanDisk has a long standing reputation that speaks for itself.",
          label: "positive",
        },
        {
          text: "I have it in my phone and it never skips a beat. File transfers are speedy and have not had any corruption issues or memory fade issues as I would expect from the Sandisk brand. Great card to own. Why entrust your precious files to a slightly cheaper piece of crap? If you lose everything can you forgive yourself for not spending the extra couple bucks on a trusted product that goes through good QA?",
          label: "positive",
        },
        {
          text: "It's hard to believe how affordable digital has become. 32 GB in a device one quarter the sie of postage stamp would have been science fiction less than a generation ago.I picked this up for portable music when I didn't want to schlep (or risk) a phone or iPod. Works great with all SD card readers.Select with confidence.",
          label: "positive",
        },
        {
          text: "Works in a HTC Rezound.  Was running short of space on a 64GB Sandisk so I ordered this when it came out, fast and no issues.",
          label: "positive",
        },
        {
          text: "in my galaxy s4, super fast card, and am totally happy, not happy having to still type to fill the required words though",
          label: "positive",
        },
        {
          text: "I like this SD Card because it can take music video downloads, personal videos, files,docs, and multimedia images with a fast transfer rate of Class 10 speed. It can take games with large files very easily and still have enough space for apps. It&#34;s great for video cameras and camcorders with the supplied adapter. Fits very easily into smartphones and tablets SD Card slots. I recommend this 32GB SD Card to everyone.",
          label: "positive",
        },
        {
          text: "It works, but file writes are a bit slower than expected on a USB3 reader.Also, both reads and writes are FASTER with the card inside the standard-size SD adapter (15 MB/s vs 10 write; 45 MB/s vs 22 MB/s read) on the same card reader.  Can't figure why...",
          label: "neutral",
        },
        {
          text: "THE NAME OF ITSELF SPEAKS OUT. GO SANDISK GO!",
          label: "positive",
        },
        {
          text: "Solid SDHC card that is fast (at reading and writing) fast (for recording video and pics), has great capacity, and is reasonably priced. I have had no issues with it.Overall, highly recommend.",
          label: "positive",
        },
        {
          text: "Heard that the card's write speed is insufficient, however I have used it extensively and haven't had a single problem with it!!",
          label: "positive",
        },
        {
          text: "I bought this to use with my go pro hero 3 black edition. It requires a class 10 MicroSDXC card. So far I've had no issues with it. Fast read/write, came with adapter, small packaging, but that's all it needed! Comes with a nice hard plastic case to keep both dry and together if needed.",
          label: "positive",
        },
        {
          text: "got this because i had a 2 GB one that filled up. i kept getting the insufficient disk space on my phone. my kids take my phone and do selfies. mostly my daughter. I had to get a bigger card. the 2GB one was a carry over from an old phone.needless to say this was sweet. plenty of space. and i dont have to delete pictures anymore. well for now at least.my daughter loves selfies.",
          label: "positive",
        },
        {
          text: "Class 10 Speed Rating for Seamless Full HD VideoThe SanDisk Ultra UHS-I card features a Class 10 and UHS Speed Class 1 (U1) rating, the highest video performance available for recording uninterrupted Full HD** video.Flawless App PerformanceThis card can retrieve stored data almost instantly, thanks to its up to 30MB/s read capability and fast bus interface. The SanDisk Ultra microSDHC and microSDXC UHS-I cards offer faster app loading and smoother, more fluid app performance.Storage Capacities Up to 64GBThis card has plenty of room to accommodate Full HD videos, MP3s, apps, and other memory-intensive mobile files. Available in sizes up to 64GB, it can store all the apps, music, and video you want.Android App for Easy File ManagementThe included SanDisk Memory Zone app lets you easily view, access, and backup all of your digital files from your phone's memory, additional memory card, and cloud service all in one convenient place. Using the app, you can easily move files from your card to a number of cloud storage services.Durable DesignSanDisk Ultra UHS-I memory cards can capture memories from -13 to 185 degrees Fahrenheit with a shockproof, waterproof, and X-ray-proof design. Your mobile device may not survive, but your SanDisk memory card will.",
          label: "positive",
        },
        {
          text: "The read and write speeds are better than the Samsung SD card that I had previously. I would not hesitate to buy another one of these great Micro SD cards from SanDisk. I also own their Clip plus MP3 player and it works very well. I think I'm becoming a fan of the SanDisk products.",
          label: "positive",
        },
        {
          text: "This works with the NL1520.  No video stuttering like with the 64gb.  Blah blah blah blah to fill in the rest.",
          label: "positive",
        },
        {
          text: "Works as expected.  High transfer speed.  Nice to have extra microSD adapters lying around since I always seem to misplace them.  Mainly bought it to use in my Nikon DSLR since I can put the card directly into my (CM modded) Nook HD+ tablet in the field and view my images on a larger screen.",
          label: "positive",
        },
        {
          text: "Works great in a Samsung Galaxy S3.  Formatted straight away, full size there.  I can't really tell the speed difference between this one and a slower card it replaced.  I guess the IO in the phone can't take advantage.",
          label: "positive",
        },
        {
          text: "SanDisk never disappoints. As always SanDisk products are worth every penny. Nice product and quality and works great. I recommend this product to everyone.",
          label: "positive",
        },
      ],
    });

    sentiment = response.body.classifications[0]?.prediction;
  } catch (error: unknown) {
    console.log(error);
  }

  return sentiment ?? "positive";
}
