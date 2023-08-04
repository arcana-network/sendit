
<p align="center">
<a href="#start"><img height="30rem" src="https://raw.githubusercontent.com/arcana-network/branding/main/an_logo_light_temp.png"/></a>
<h2 align="center"> <a href="https://arcana.network/">Arcana Network SendIt Application </a></h2>
</p>
<br/>
<p id="banner" align="center">
<br/>
<a title="Copyright Arcana Network" href="https://arcana.network"><img src="https://img.shields.io/badge/Copyright-Arcana-black"/></a>
<a title="Beta release" href="https://github.com/arcana-network/send-it/releases"><img src="https://img.shields.io/github/v/release/arcana-network/send-it?style=flat-square&color=28A745"/></a>
<a title="Twitter" href="https://twitter.com/ArcanaNetwork"><img alt="Twitter URL" src="https://img.shields.io/twitter/url?style=social&url=https%3A%2F%2Ftwitter.com%2FArcanaNetwork"/></a>
<a title="CodeCov" href="https://codecov.io/gh/arcana-network/send-it"> 
 <img src="https://codecov.io/gh/arcana-network/sendit-it/branch/dev/graph/badge.svg?token=KmdjEs3enL"/></a>
</p><p id="start" align="center">
<a href="https://docs.arcana.network/"><img src="https://raw.githubusercontent.com/arcana-network/branding/main/arcana_sendit_banner.png" alt="Arcana Network SendIt Application"/></a>
</p>

# SendIt Application

The Arcana Network SendIt application allows users to send crypto via email or Twitter handle of the receiver. Having a wallet address is not a pre-requisite for receiving crypto. Once the recipient accepts and claims the received crypto, a new wallet address is automatically associated with their email identifier or Twitter handle. All the received crypto can be accessed using this wallet.

SendIt uses the Arcana Auth SDK under the covers that helps users onboard Web3 apps easily.  For more details, see [Arcana Auth Documentation](https://docs.arcana.network).

You can check out the SendIt application deployed on Arcana Mainnet: https://sendit.arcana.network

<img src="https://raw.githubusercontent.com/arcana-network/branding/main/sendit.gif" alt="SendIt App">

## Using SendIt

Simply log into https://sendit.arcana.network. 

### Send Crypto 

To be able to send crypto, the whitelisted users MUST log in using Google, Twitter or other supported authentication providers. Also, they must have a non-zero balance in the Arcana wallet.  All whitelisted users will be bootstrapped with some Polygon Mumbai Testnet MATIC tokens so that their wallet has non-zero balance.

After logging in, whitelisted users can access the Arcana wallet. View various tokens and crypto assets associated with the wallet.  They can use SendIt app to send crypto to any email ID or Twitter handle. Once the transaction is confirmed, they can send an email to the recipient informing them about the SendIt link to retrieve the received crypto.  There are other options to earn rewards and XP by sending shoutouts and sharing experience with the larger community.

Whitelisted users can also use the Arcana wallet to send and receive crypto from other wallet addresses.

### Receive Crypto

To receive crypto that has been gifted/sent to a user via email ID or twitter, the sender must ensure that they email or share the SendIt link displayed in the app after they confirm the send transaction. The recipient can use this link to claim the crypto.  As part of claiming the crypto, they need to use the same emailID or Twitter handle and log into the SendIt app: https://sendit.arcana.network.  For email log in, a verification email will be sent to the same email ID. User needs to verify to log in. Post log in, user's email ID or Twitter handle, that was used to log in is associated with a wallet address automatically.  This wallet is completely private, owned by the user. User can see the SendIt app dashboard, click on the Arcana wallet on the bottom right and view the wallet balance.

The recipients become automatially whitelisted and they can send / share crypto with other users via email ID, Twitter handle via SendIt. They can also share crypto via any wallet address by using the Arcana wallet UI to send crypto, view NFTs and more.

For details on using the Arcana wallet, see [Arcana Wallet User Guide](https://docs.arcana.network/user-guides/wallet-ui/index.html).

## Building SendIt

SendIt is a Vue app written in TypeScript that uses the Vite framework. The 'dev' build is deployed on the Arcana Testnet at https://sendit-app.dev.arcana.network and the Mainnet app is deployed at https://sendit.arcana.network for access.  New users require and invite to get on to SendIt. Only the whitelisted users can use the app to send crypto. Anyone, even non SendIt account holders can receive crypto via their email ID or Twitter handle. 

### Vue 3 + TypeScript + Vite

This template should help get you started developing with Vue 3 and TypeScript in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

#### Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

#### Type Support For `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin) to make the TypeScript language service aware of `.vue` types.

If the standalone TypeScript plugin doesn't feel fast enough to you, Volar has also implemented a [Take Over Mode](https://github.com/johnsoncodehk/volar/discussions/471#discussioncomment-1361669) that is more performant. You can enable it by the following steps:

1. Disable the built-in TypeScript Extension
   1. Run `Extensions: Show Built-in Extensions` from VSCode's command palette
   2. Find `TypeScript and JavaScript Language Features`, right click and select `Disable (Workspace)`
2. Reload the VSCode window by running `Developer: Reload Window` from the command palette.

## Documentation

SendIt uses Arcana Network Auth SDK under the covers. Check out [Arcana Network documentation](https://docs.arcana.network/) for [Auth SDK Quick Start Guide](https://docs.arcana.network/walletsdk/wallet_qs.html) and [API Reference Guide](https://authsdk-ref-guide.netlify.app).
