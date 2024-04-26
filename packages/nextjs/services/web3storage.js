import { create } from "@web3-storage/w3up-client";

const client = await create();

await client.login("bwilliamwang@gmail.com");

export async function storeWeb3FilesTest() {
  await client.setCurrentSpace("did:key:z6MkeuYZbwfNXzDLpWndsjDAYYkUvPvQpPnqaQQXFVoPykRc");

  const path = "./web3storageold.js";
  const files = await filesFromPaths([path]);

  const directoryCid = await client.uploadDirectory(files);
  console.log("directoryCid", directoryCid);

  return directoryCid;
}
