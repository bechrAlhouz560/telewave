import { TelegramClient } from "telegram";
import { EntityLike } from "telegram/define";

// TELEGRAM API CODES
export const API_ID = 8587085;
export const API_HASH = "18ebc22e6568b2841b755c252f0cb33e";

export async function getUserProfile(
  client: TelegramClient,
  entity: EntityLike = "me"
) {
  const buffer = await client.downloadProfilePhoto(entity);
  const blob = new Blob([buffer], { type: "image/jpg" });
  const url = URL.createObjectURL(blob);
  return url;
}

export function isElectron() {
  // Renderer process
  if (
    typeof window !== "undefined" &&
    typeof window.process === "object" &&
    window.process.type === "renderer"
  ) {
    return true;
  }

  // Main process
  if (
    typeof process !== "undefined" &&
    typeof process.versions === "object" &&
    !!process.versions.electron
  ) {
    return true;
  }

  // Detect the user agent when the `nodeIntegration` option is set to true
  if (
    typeof navigator === "object" &&
    typeof navigator.userAgent === "string" &&
    navigator.userAgent.indexOf("Electron") >= 0
  ) {
    return true;
  }

  return false;
}

export function formatDateHM(date: any) {
  date = new Date(date);
  var hours = date.getHours().toString().padStart(2, "0");
  var minutes = date.getMinutes().toString().padStart(2, "0");

  return hours + ":" + minutes;
}

export const isValidUrl = (url: string) => {
  var urlPattern = new RegExp(
    "^(https?:\\/\\/)?" + // validate protocol
      "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // validate domain name
      "((\\d{1,3}\\.){3}\\d{1,3}))" + // validate OR ip (v4) address
      "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // validate port and path
      "(\\?[;&a-z\\d%_.~+=-]*)?" + // validate query string
      "(\\#[-a-z\\d_]*)?$",
    "i"
  ); // validate fragment locator
  return !!urlPattern.test(url);
};

export function blobToBase64(blob: Blob)  : Promise<string> {
  return new Promise(function (resolve, reject) {
    var reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = function () {
      var base64data = reader.result;
      if (typeof base64data === "string") {
        resolve(base64data);
      }
      else {
        return "";
      }
    };
    reader.onerror = reject;
  });
}


export function isSerializable(obj : any, key : string) {
  try {
    const value = obj[key];
    // Try to stringify the value
    JSON.stringify(value);
    return true;
  } catch (e) {
    return false;
  }
}

export function formatTimestamp(unixTimestamp : number) {
  const date = new Date(unixTimestamp * 1000); // convert to milliseconds
  const hours = date.getUTCHours().toString().padStart(2, '0');
  const minutes = date.getUTCMinutes().toString().padStart(2, '0');
  const seconds = date.getUTCSeconds().toString().padStart(2, '0');

  if (hours === '00') {
    return `${minutes}:${seconds}`;
  } else {
    return `${hours}:${minutes}:${seconds}`;
  }
}

export function bytesToMegabytes(bytes : number) {
  const megabytes = bytes / (1024 * 1024); // 1 MB = 1024 * 1024 bytes
  return megabytes.toFixed(2); // returns the value rounded to two decimal places
}

export async function wait (ms : number) {
  return new Promise(function (resolve) {
      setTimeout(resolve , ms)
  })
}