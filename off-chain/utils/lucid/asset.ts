import { BLOCKFROST_URL } from "../../common/constants.ts";
import { getBlockfrostProvider, lucid, sumUtxos } from "./mod.ts";
import { fromHex, fromUnit, toHex, Unit, UTxO } from "lucid";

export async function getAssetsWithPolicyIdAt(
  address: string,
  policyId: string,
): Promise<Unit[]> {
  const utxos = await lucid.utxosAt(address);

  const allAssets = sumUtxos(utxos);
  delete allAssets["lovelace"];
  const specificAssets: string[] = [];

  for (const unit in allAssets) {
    const asset = fromUnit(unit);
    if (asset.policyId === policyId) {
      specificAssets.push(unit);
    }
  }
  return specificAssets;
}

export async function getOnChainMetadata(unit: Unit): Promise<any> {
  const assetInfo = await getAssetInfo(unit);
  return assetInfo.onchain_metadata;
}

export async function getAssetInfo(unit: Unit): Promise<any> {
  const provider = getBlockfrostProvider();
  const info = await fetch(
    `${BLOCKFROST_URL}/assets/${unit}`,
    { headers: { project_id: provider.projectId } },
  ).then((res) => res.json());

  if (!info || info.error) {
    throw new Error("Asset infomation not found." + info.error);
  }
  return info;
}

// Returns a unique asset name suffix using a utxo's txid and idx
// The asset label (as per CIP68) can then prefixed to the name for a unique asset name
export async function getUniqueAssetNameSuffix(utxo: UTxO): Promise<string> {
  const hash = new Uint8Array(
    await crypto.subtle.digest(
      "SHA3-256",
      fromHex(utxo.txHash),
    ),
  );

  // Create unique asset name suffix of 28 bytes. The remaining 4 bytes come
  // from the asset label as a prefix.
  return toHex(new Uint8Array([utxo.outputIndex])) +
    toHex(hash.slice(0, 27));
}
