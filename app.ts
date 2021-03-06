import { delay } from "./utils/delay.ts";
import { colorHexToHsl } from "./utils/colorHexToHsl.ts";

console.log("Starting");

const isDevelopment = Deno.args.includes("development");

const neewerLiteBaseUrl = "http://localhost:8080/NeewerLite-Python/doAction?";
const apiListUrl = isDevelopment
  ? "http://localhost:8000/api/things"
  : "https://czechitas-chytra-domacnost.herokuapp.com/api/things";

const rgbLights = [
  {
    mac: "EC:C7:10:29:B1:22",
    apiUrl: "",
    lastKnownHexColor: "",
    lastUpdate: new Date(),
  },
  {
    mac: "C2:BF:C7:30:AA:F3",
    apiUrl: "",
    lastKnownHexColor: "",
    lastUpdate: new Date(),
  },
];

console.log("Discovering RGB lights");

console.log("Getting RGB light api urls");
const apiListResponse = await fetch(apiListUrl);
const apiListData = await apiListResponse.json();

interface Thing {
  id: string;
  type: string;
  url: string;
}

const apiListRgbLights: Thing[] = apiListData.things.filter((thing: Thing) =>
  thing.type === "rgbLight"
);

rgbLights.forEach((rgbLight, i) => {
  rgbLight.apiUrl = apiListRgbLights[i].url;
  console.log(`Linking RGB light ${rgbLight.mac} to ${apiListRgbLights[i].id}`);
});

console.log("Starting infinite loop to periodically synchronize things");
while (true) {
  for (const rgbLight of rgbLights) {
    try {
      const response = await fetch(rgbLight.apiUrl);
      const hexColor: string = (await response.json()).color;
      const now = new Date();
      if (
        hexColor !== rgbLight.lastKnownHexColor ||
        now.getTime() - rgbLight.lastUpdate.getTime() > 7000 // To eventually synchronize
      ) {
        const hslColor = colorHexToHsl(hexColor);
        console.log(`Setting rgb light ${rgbLight.mac} color to ${hexColor}`);
        const response = await fetch(
          `${neewerLiteBaseUrl}light=${rgbLight.mac}&mode=HSI&hue=${hslColor.h}&sat=${hslColor.s}&bri=${hslColor.l}`,
        );
        if (response.ok) {
          rgbLight.lastKnownHexColor = hexColor;
          rgbLight.lastUpdate = now;
        }
        await delay(2000); // To protect NeeweLite python from overload
      }
    } catch (error) {
      console.error(error);
    }
    await delay(500);
  }
}
