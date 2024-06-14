<div align="center">
  <img src="https://avatars.githubusercontent.com/u/85499411?s=200&v=4#gh-light-mode-only" alt="Socket Logo" />
  <img src="https://avatars.githubusercontent.com/u/85499411?s=200&v=4#gh-dark-mode-only" alt="Socket Logo" />
</div>

# Socket Plugs

## Overview

This project features a collection of applications built using Socket's data layer.

### Important Directories

- `contracts` - Source code for the contracts.
- `deployments` - Deployment addresses for the project, categorized by project type (SuperToken, SuperBridge).
- `scripts` - Scripts for deploying, verifying contracts, and more.
- `scripts/constants/projectConstants` - Project constants, categorized by project type (SuperToken, SuperBridge).
- `src/enums` - Token and project enums.
- `test` - Tests for the contracts.

### Components

**SuperToken**
SuperTokens are contracts that enable the creation of tokens on multiple chains. They function by locking/unlocking tokens on the initial chain using a Vault and minting/burning tokens on the destination chain using a Controller. More details on SuperTokens can be found [here](./SUPERTOKEN_README.md).

**SuperBridge**
SuperBridges are contracts that allow Chains or AppChains to onboard assets and tokens from other chains. They use lock/unlock mechanisms on the source chain and mint/burn mechanisms on the destination chain. More details on SuperBridges can be found [here](./SUPERBRIDGE_README.md).

**Hook Contracts**
Hooks are extensions to the SuperBridge and SuperToken. They add additional functionality to the bridge or token and are invoked during the execution of a SuperBridge or SuperToken transaction.

## Setup

Clone project and install dependencies.

```bash
git clone https://github.com/SocketDotTech/socket-plugs
```

Move to the repository folder and install dependencies.

```bash
cd socket-plugs
```

Install all dependencies.

```bash
yarn setup:all
```

Now `socket` command will be available to use in the root directory.

To get available features run:

```bash
socket help
```

## Create a new project

To create a new project, run:

```bash
socket new
```

Follow the prompts to create a new project. This will create a new project in `scripts/constants/projectConstants/supertoken/projectname_<mainnet/testnet>.ts` or `scripts/constants/projectConstants/superbridge/projectname_<mainnet/testnet>.ts`.

**Note:** this scripts updates your .env to add relevant env variables. If you have anything sensitive/important in .env file, please take a backup first.

## SuperBridge requirements

- On the destination chain, the token must be deployed and follow the [IMintableERC20 interface](./contracts/interfaces/IMintableERC20.sol).
- Update the `src/enums/existing-token-addresses.ts` file to add the address of the token on the destination chain (it may be needed to add the ChainSlug).

## Deployment

**Note:** Ensure you have the correct environment variables set in your .env file. You need to set `OWNER_SIGNER_KEY` and RPC URLs for the network you are deploying to.

To deploy the contracts, run:

```bash
yarn script:deploy
```

**Note:** based on the chain you may run into some rpc issues like `intrinsic gas too low`, etc. while running the deploy script. We store network overrides in `script/helpers/networks.ts`. You can add overrides for gasPrice, gasLimits to be used by all scripts. For example, if you are running the script for arbitrum sepolia, and it throw `intrinsic gas too low` error, try increasing gas limit for arbitrum sepolia to 5 million and retry.

## Verify the contracts on a block explorer

Add API keys for the block explorers you want to verify the contracts in the `.env` file. You might also need to update the `hardhat.config.ts` file to add the API keys for the block explorers you want to verify the contracts on.

**Note:** If you are verifying the contracts for SuperBridge on the destination chain, you need to update the `hardhat.config.ts` file to add the network in `liveNetworks` and to add your chain in `customChains`.

To verify the contracts on a block explorer, you can use the following command:

```bash
yarn script:verify --network <your network>
```

## Project Constants Help Guide

- **Vault Chains** - The chains where the token contract is already deployed, and the token will be locked/unlocked for bridging.

  - For superbridge, we will have ≥1 vault chains where we will bridge from.
  - For supertoken, if the token is already deployed on a chain, then that chain will be a vault chain. If it is a fresh supertoken deployment (token does not exist on any chain), there will be no vault chains. Therefore, for supertoken, the number of vault chains ≤1.

- **Controller Chains** - The chains where the token is minted/burned.

  - For superbridge, this will be the new chain where users are bridging. There will be only 1 controller chain (app chain) for superbridge.
  - For supertoken, all the chains (except the one where the token is deployed) are controller chains, as the token is minted/burned. The number of controller chains ≥1.
  - Note: If you are not able to find your chain in the list of chains during setup, check if the chain already has socket core contracts deployed, and if you have updated the @socket.tech/dl-core package.

- **Hooks** - Hooks are plugins that can be added for extra functionality. We have 2 options for hooks right now:

  - **LIMIT_HOOK** - This hook enforces daily send and receive limits for a token. It makes sure that in case of a hack, the flow of funds is rate-limited. It also checks before withdrawal whether the destination chain has enough funds for successful bridging, and reverts on the source chain to avoid the bad UX of stuck funds. This is the recommended hook. With this hook, we need to specify sending and receiving limits for each token and each supported chain.
  - **LIMIT_EXECUTION_HOOK** - This hook extends the capability of LIMIT_HOOK and allows for arbitrary payload execution on the destination after the bridge is successful.
    You can also write your own custom hooks and plug them into the bridge contracts.

- **Rate Limits** - You can specify per token daily sending and receiving limits.

  - The limits are specified in formatted (ETH) values, i.e., use 1000 for a 1000 USDC limit. The limit specified is the max daily limit.
  - When a user bridges, the current limit is reduced and is regenerated per second (rate = max_limit / 86400 per sec) until it reaches the max limit again. If a user bridges an amount that is greater than the current limit, then the current limit amount of tokens is sent to the user, and the rest are stored as pending, which are released as the limit regenerates.
  - There are view functions on the LIMIT_HOOK contract to fetch the max limit, current limit, rate of increase, etc.
  - Rate limits help to reduce the attack surface in case of a hack by limiting the throughput of the bridge.

- **Integration Types** - We have 3 options for integration types (Recommended: FAST)
  - FAST: This is the default integration type. It uses socket's 1/n security model to verify messages. Bridging time is ~5-10 mins.
  - OPTIMISTIC: This integration type uses an optimistic security model, where messages are executed after 2 hours.
  - NATIVE_BRIDGE: This uses the native messaging bridge of underlying chains. This provides the security of NATIVE bridges.
- **Pool Count** - This only applies for superbridge. Normally, we don't need to specify this and have a default value of 0.
  - When we are bridging out from an App chain (controller chain), we check if the destination chain has enough liquidity to allow the user to bridge successfully. This accounting is done in poolPlugin.
  - We support different paths for bridging, i.e., FAST, OPTIMISTIC, and NATIVE_BRIDGE. If a user bridges to a chain using the NATIVE_BRIDGE path and wants to withdraw using the FAST path, we can allow the user to do that by keeping the poolCount for both paths the same. If we don't want to allow this, we can restrict this behavior by keeping the poolId different.

## Test

Tests are run using the [Forge](https://github.com/foundry-rs/foundry/tree/master/forge) tool of [Foundry](https://github.com/foundry-rs/foundry).

```bash
forge test
```
