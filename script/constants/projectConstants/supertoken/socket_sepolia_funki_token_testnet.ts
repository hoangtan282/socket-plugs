import {
  ChainSlug,
  DeploymentMode,
  IntegrationTypes,
} from "@socket.tech/dl-core";
import { Hooks, ProjectConstants } from "../../../../src";
import { Tokens } from "../../../../src/enums";

export const pc: ProjectConstants = {
  [DeploymentMode.PROD]: {
    [Tokens.SIPHER]: {
      vaultChains: [ChainSlug.SEPOLIA],
      controllerChains: [ChainSlug.SIPHER_FUNKI_TESTNET],
      hook: {
        hookType: Hooks.LIMIT_HOOK,
        limitsAndPoolId: {
          [ChainSlug.SIPHER_FUNKI_TESTNET]: {
            [IntegrationTypes.fast]: {
              sendingLimit: "10000",
              receivingLimit: "100000",
            },
          },
          [ChainSlug.SEPOLIA]: {
            [IntegrationTypes.fast]: {
              sendingLimit: "10000",
              receivingLimit: "100000",
            },
          },
        },
      },
      superTokenInfo: {
        name: "Sipher",
        symbol: Tokens.SIPHER,
        decimals: 18,
        owner: "0xD6824e69Bc24889740fDfC6371Bf985A7ab7ac7f",
        initialSupplyOwner: "0xD6824e69Bc24889740fDfC6371Bf985A7ab7ac7f",
        initialSupply: "0",
      },
    },
    [Tokens.USDC]: {
      vaultChains: [ChainSlug.SEPOLIA],
      controllerChains: [ChainSlug.SIPHER_FUNKI_TESTNET],
      hook: {
        hookType: Hooks.LIMIT_HOOK,
        limitsAndPoolId: {
          [ChainSlug.SIPHER_FUNKI_TESTNET]: {
            [IntegrationTypes.fast]: {
              sendingLimit: "10000",
              receivingLimit: "100000",
            },
          },
          [ChainSlug.SEPOLIA]: {
            [IntegrationTypes.fast]: {
              sendingLimit: "10000",
              receivingLimit: "100000",
            },
          },
        },
      },
      superTokenInfo: {
        name: Tokens.USDC,
        symbol: Tokens.USDC,
        decimals: 6,
        owner: "0xD6824e69Bc24889740fDfC6371Bf985A7ab7ac7f",
        initialSupplyOwner: "0xD6824e69Bc24889740fDfC6371Bf985A7ab7ac7f",
        initialSupply: "0",
      },
    },
  },
};
