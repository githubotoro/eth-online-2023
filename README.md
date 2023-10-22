<!-- PROJECT HEADER -->

<div align="center">
  <a href="https://ethline.vercel.app/">
    <img src="images/ethline-logo.png" alt="logo" width="20%">
    <h1>ETH-Line ☎️</h1>
  </a>
  
  <p align="center">
    <a href="https://ethline.vercel.app/">View Project</a>
    |
    <a href="https://ethglobal.com/showcase/eth-line-ygmy8">Hackathon Submission</a>
    <br/>
    <b>If you like this project, don't forget to give it a star! <br/> Thanks! 😊</b>
  </p>
</div>

## **ETH-Line In A Tweet ✒️**

> A platform for **connecting** Ethereum addresses via `facetime`, `voice calls` and `chats`.

<!-- PROJECT LINKS -->

## **Project Links 🔗**

> 📌 **[Website](https://ethline.vercel.app/) (ethline.vercel.app)**

> 🌐 **[ETH Global Hack Submission](https://ethglobal.com/showcase/eth-line-ygmy8)**

> 💻 **GitHub Source Code: [Monorepo](https://github.com/githubotoro/eth-online-2023)**

<!-- PROJECT LINKS -->

## **Project Demo 🌈**

[![Watch the video](/images/banner.png)](https://ethglobal.com/showcase/eth-line-ygmy8)

<!-- PROJECT HEADER -->

<!-- PROJECT EVOLUTION -->

## **Project Description 🚀**

-   The goal of this project is to make web3 natives better connected with each other via giving them the opportunity to have video + voice calls along with chats.

-   The web app doesn't require any user id and password to login -- instead it uses web2 authentication services like Face ID, Touch ID and passcode to authenticate the user.

-   User can chat with any other user on the network via 2 ways -- Push Protocol and XMTP.

-   The video and voice calling feature works by setting a Web RTC connection, sending Push notification and again, receiving notification via Push sockets at peer side.

-   Whenever a new notification, it is parsed through regular expression to detect its purpose and intent.

<!-- PROJECT EVOLUTION -->

<!-- ABOUT THE PROJECT -->

## **Major Technologies 📌**

-   Cometh: This project uses Cometh for biometric verification like Face ID, Touch ID, Passcode, etc. & converts them to a EVM wallet on user's device. Cometh highly reduces the friction of on-boarding the native web2 users into the platform as now, users don't need to have a wallet in order to get started.

-   Push Protocol: This project uses Push Protocol for notifications as well as chats. Push provides highly convenient way to develop applications by simplifying the process of sending + receiving notifications. Moreover, with the help of Chat SDK and sockets -- it also opens a way for ETH-Line users in connecting to each other.

-   XMTP: This project uses XMTP as chat medium where users can send + receive messages. Whenever a user registers on ETH-Line via Cometh -- their XMTP keys are automatically created by the app. Hence, users can start chatting as soon as they are on the platform.

-   Mask Network: The web3 bio APIs are used to query to link a user's on-chain identities to the platform. If users want to being their digital identities to the platform -- they just have to connect their wallet and it's done -- no signing messages and no approving transactions.
<!-- ABOUT THE PROJECT -->

<!-- BUILT WITH -->

## **Built With 🔍**

-   Next.js 13 as the full-stack app
-   Firebase for storing call and user information.
-   Zustand for state management
-   React-hot-toast for notification UI
-   Tailwind for styling the entire app
-   RainbowKit for connecting user's on-chain identities
-   Ethers for handling all wallet based operations
-   Wagmi for ethereum hooks in the app
-   Vercel for hosting the app
-   Alchemy for fetching RPC provider on Polygon Mumbai Testnet

<!-- BUILT WITH -->

<!-- HOW IT WAS BUILT -->

## **Some Hacks 😎**

-   Push Protocol: Instead of setting up my own server for sending and receiving call IDs -- I have used Push Notifications to send signal to the peer address via Push notifications. Moreover, Push sockets are continuously listening for any new notifications and thereby, peer can receive the call instantly.

-   Regular Expressions: The notification title consists of the main task to perform for the sockets that are listening to such events. Here, I have applied regular expressions in order to extract those useful information client-side and thereby, making the entire experience seamless.

<!-- HOW IT WAS BUILT -->

<!-- GETTING STARTED -->

## **Getting Started 🚀**

> All you need to get started with this project is an **invite code** to ETH-Line 👀

### **Installation 💻**

1.  **Clone** this repo.
    ```sh
    git clone https://github.com/githubotoro/eth-online-2023
    ```
2.  **Get** your own API keys for all the variables mentioned in `.env.sample` file.
3.  **Install** packages.
    ```sh
    pnpm install
    ```
4.  **Start** the project.

    ```sh
    pnpm run dev
    ```

5.  **Time to call those addresses! ✅**

<!-- GETTING STARTED -->

<!-- CONTACT -->

## **Contact 👋**

> **Uday Khokhariya**

-   **Twitter** - [yupuday](https://twitter.com/yupuday)
-   **Email** - uday.khokhariya@gmail.com

<!-- CONTACT -->
