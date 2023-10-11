import { BLOCKFROST_URL, NETWORK } from "../../common/constants.ts";
import { Blockfrost, Lucid, Network, Provider } from "lucid";

export const lucid = await Lucid.new(undefined, NETWORK);

export async function createLucidInstance(
  provider?: Provider,
  network?: Network,
) {
  let defaultNetwork = NETWORK;
  let defaultProvider: Provider = new Blockfrost(
    BLOCKFROST_URL,
    Deno.env.get("BLOCKFROST_API_KEY"),
  );

  if (provider) {
    defaultProvider = provider;
  }
  if (network) {
    defaultNetwork = network;
  }

  return await Lucid.new(defaultProvider, defaultNetwork);
}

// Parameter to 'JSON.stringify()' to help with bigint conversion
export function bigIntReplacer(_k: any, v: any) {
  return typeof v === "bigint" ? v.toString() : v;
}
