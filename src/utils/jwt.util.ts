// jwt.ts

function base64UrlEncode(str: string) {
  return btoa(str)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
}

function base64UrlDecode(str: string) {
  str = str.replace(/-/g, "+").replace(/_/g, "/");

  while (str.length % 4) {
    str += "=";
  }

  return atob(str);
}

async function hmacSHA256(message: string, secret: string) {
  const encoder = new TextEncoder();

  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    {
      name: "HMAC",
      hash: "SHA-256",
    },
    false,
    ["sign"]
  );

  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(message)
  );

  return base64UrlEncode(
    String.fromCharCode(...new Uint8Array(signature))
  );
}

export async function createFakeJwt(
  data: any,
  secret: string
): Promise<string> {
  const header = {
    alg: "HS256",
    typ: "JWT",
  };

  const headerBase64 = base64UrlEncode(JSON.stringify(header));
  const payloadBase64 = base64UrlEncode(JSON.stringify(data));

  const unsigned = `${headerBase64}.${payloadBase64}`;

  const signature = await hmacSHA256(unsigned, secret);

  return `${unsigned}.${signature}`;
}

export async function parseFakeJwt<T>(
  token: string,
  secret: string
): Promise<T> {
  const [header, payload, signature] = token.split(".");

  const unsigned = `${header}.${payload}`;

  const expected = await hmacSHA256(unsigned, secret);

  if (expected !== signature) {
    throw new Error("Invalid token");
  }

  return JSON.parse(base64UrlDecode(payload));
}

