import { JoseKey } from "@atproto/jwk-jose";

const key = await JoseKey.generate()

console.log(JSON.stringify(key))
