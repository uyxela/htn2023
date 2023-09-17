<a name="readme-top"></a>

# Curio

Curio is a Chrome Extension that saves you time by automatically fetching product details from e-commerce websites and searching the web for reviews about that product. A summary of reviews is given along with the overall sentiment to help you make more informed buying decisions without having to spend hours researching.

Users can also save products to their profile and like reviews to view them later. The data collected about products and reviews is used to build a product database that users can search directly to find the exact products they are looking for.

<br />
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>

## About The Project

![Screenshot](https://github.com/uyxela/hackmit2022/blob/main/samples/screenshot.png?raw=true)

Curio is a Chrome browser extension that extracts the product name and brand from a web page and searches the web for reviews about that product. It generates a summary, sentiment, and list of summarized reviews for that product and stores it in the Curio database. Users can bookmark and like products and reviews to view them later. Users can also perform searches on products and keywords to find products that match their needs, with feedback from other users to help them in their decision-making process.

### Built With

[![React][React]][React-url]
[![TypeScript][TypeScriptLang]][TS-url]
[![Express][Express]][Express-url]
[![NodeJS][NodeJS]][NodeJS-url]
[![CockroachDB][CockroachDB]][CockroachDB-url]
[![Prisma][Prisma]][Prisma-url]
[![Cohere][Cohere]][Cohere-url]

## Getting Started

To get a local copy up and running follow these steps.

### Prerequisites

Ensure that `node` and `npm` are installed.

### Installation

1. Clone the repository.
   ```sh
   git clone git@github.com:uyxela/htn2023.git
   ```
2. Run the following command from the `extension` directory.

   ```sh
   npm install
   ```

3. Enter the values in `/server/.env`.

   ```
   PORT=5000
   DATABASE_URL=
   COHERE_API_KEY=
   JWT_SECRET=
   ```

4. Run the following commands from the `server` directory.

   ```sh
   npm install

   npx prisma generate

   npx prisma migrate dev
   ```

## Usage

To start the app, run the commands in their respective directories.

```sh
# Build the Chrome extension
cd extension && npm run build

# Start the backend
cd server && npm start
```

To run the extension, you will need to navigate to the Google Chrome extensions tab, enable developer mode, and load the `extension/build` directory as an unpacked extension.

## Contributing

If you have a suggestion that would make this better, please fork the repository and create a pull request. Don't forget to give the project a star!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

Distributed under the MIT License. See `LICENSE` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- Links and images for the Built With section -->

[React]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
[TypeScriptLang]: https://img.shields.io/badge/TypeScript-3178c6?style=for-the-badge&logo=typescript&logoColor=white
[TS-url]: https://www.typescriptlang.org/
[Express]: https://img.shields.io/badge/Express-FFFFFF?style=for-the-badge&logo=express&logoColor=black
[Express-url]: https://expressjs.com/
[NodeJS]: https://img.shields.io/badge/NodeJS-90C53F?style=for-the-badge&logo=node.js&logoColor=white
[NodeJS-url]: https://nodejs.org/
[CockroachDB]: https://img.shields.io/badge/CockroachDB-0b052b?style=for-the-badge&logo=postgresql&logoColor=white
[CockroachDB-url]: https://www.cockroachlabs.com/
[Prisma]: https://img.shields.io/badge/Prisma-ffffff?style=for-the-badge&logo=prisma&logoColor=black
[Prisma-url]: https://www.prisma.io/
[Cohere]: https://img.shields.io/badge/Cohere-3B5047?style=for-the-badge&logoColor=black
[Cohere-url]: https://cohere.com/
