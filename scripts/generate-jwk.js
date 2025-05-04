const { privateKey } = await crypto.subtle.generateKey(
  { name: "ECDSA", namedCurve: "P-256" },
  true,
  ["sign", "verify"],
);

const jwkJson = JSON.stringify(
  await crypto.subtle.exportKey("jwk", privateKey),
);

console.log(jwkJson);
