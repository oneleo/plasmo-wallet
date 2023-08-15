import * as Messaging from "@plasmohq/messaging"

const SALT_LENGTH = 16
const IV_LENGTH = 12

export type RequestBody = {
  password: string
  data: string
  keyUsages: "encrypt" | "decrypt"
}

export type ResponseBody = {
  data: string
}

const handler: Messaging.PlasmoMessaging.MessageHandler<
  RequestBody,
  ResponseBody
> = async (req, res) => {
  console.log(`[messaging][cryptoSubtle] Request: ${JSON.stringify(req)}`)

  const password = req.body.password
  const inputData = req.body.data
  const keyUsages = req.body.keyUsages

  const deriveKey = async (
    password: string,
    salt: BufferSource,
    keyUsages: KeyUsage[]
  ) => {
    const passwordKey = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(password),
      "PBKDF2",
      false,
      ["deriveKey"]
    )
    const key = await crypto.subtle.deriveKey(
      {
        name: "PBKDF2",
        salt,
        iterations: 250000,
        hash: "SHA-256"
      },
      passwordKey,
      { name: "AES-GCM", length: 256 },
      false,
      keyUsages
    )
    return key
  }

  let outputData: string
  // 加密
  if (keyUsages === "encrypt") {
    const initializationVector = crypto.getRandomValues(
      new Uint8Array(IV_LENGTH)
    )
    const salt = crypto.getRandomValues(new Uint8Array(SALT_LENGTH))

    const key = await deriveKey(password, salt, ["encrypt"])

    const encrypted = await crypto.subtle.encrypt(
      {
        name: "AES-GCM",
        iv: initializationVector
      } as Algorithm,
      key,
      new TextEncoder().encode(JSON.stringify(inputData))
    )
    const data = new Uint8Array(encrypted)

    const buffer = new Uint8Array(
      initializationVector.byteLength + salt.byteLength + data.byteLength
    )

    buffer.set(initializationVector, 0)
    buffer.set(salt, initializationVector.byteLength)
    buffer.set(data, initializationVector.byteLength + salt.byteLength)

    outputData = btoa(String.fromCharCode.apply(null, buffer))
  }

  // 解密
  if (keyUsages === "decrypt") {
    const buffer = Uint8Array.from(atob(inputData), (c) => c.charCodeAt(null))

    const initializationVector = buffer.slice(0, IV_LENGTH)
    const salt = buffer.slice(IV_LENGTH, IV_LENGTH + SALT_LENGTH)
    const data = buffer.slice(IV_LENGTH + SALT_LENGTH)

    const key = await deriveKey(password, salt, ["decrypt"])

    const decrypted = await crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv: initializationVector
      },
      key,
      data
    )

    outputData = JSON.parse(new TextDecoder().decode(decrypted))
  }

  res.send({
    data: outputData
  })
}

export default handler
