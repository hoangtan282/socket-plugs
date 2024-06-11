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
    },
  },
};
