import { ChainSlug, IntegrationTypes } from "@socket.tech/dl-core";

export enum CONTRACTS {
  MintableToken = "MintableToken",
  NonMintableToken = "NonMintableToken",
  Vault = "Vault",
  Controller = "Controller",
  ExchangeRate = "ExchangeRate",
  ConnectorPlug = "ConnectorPlug",
}

export type DeploymentAddresses = {
  [chainSlug in ChainSlug]?: Common;
};

export interface Common extends AppChainAddresses, NonAppChainAddresses {
  isAppChain: boolean;
  connectors?: Connectors;
}

export interface AppChainAddresses {
  [CONTRACTS.MintableToken]?: string;
  [CONTRACTS.Controller]?: string;
  [CONTRACTS.ExchangeRate]?: string;
}

export interface NonAppChainAddresses {
  [CONTRACTS.NonMintableToken]?: string;
  [CONTRACTS.Vault]?: string;
}

export type Connectors = {
  [chainSlug in ChainSlug]?: ConnectorAddresses;
};

export type ConnectorAddresses = {
  [integration in IntegrationTypes]?: string;
};