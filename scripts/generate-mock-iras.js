import { v4 } from "uuid";
import fs from "fs";
const amountOfIras = 60;

const groups = ["default", "group1", "group2", "group3", "group4", "group5"];

const iras = [];

const RGBOutputs = [
  "1.rgb",
  "2.rgb",
  "3.rgb",
  "4.rgb",
  "5.rgb",
  "6.rgb",
  "7.rgb",
  "8.rgb",
  "1.fx",
  "2.fx",
  "3.fx",
  "4.fx",
  "5.fx",
  "6.fx",
  "7.fx",
  "8.fx",
];

const effects = ["rainbow", "strobe", "fade", "solid", "off"];

function randomColorHex() {
  return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
}

const DMXOutputs = ["dmx.raw", "dmx.rgb", "dmx.fx"];

function randomFromArray(array) {
  return array[Math.floor(Math.random() * array.length)];
}

for (let i = 0; i < amountOfIras; i++) {
  const deviceId = v4().split("-")[0];
  const group = randomFromArray(groups);

  const output = randomFromArray(RGBOutputs);

  let payload = "";

  // Generate four payloads per device
  for (let j = 0; j < 4; j++) {
    const topic = `area3001.ira.${group}.devices.${deviceId}.output.${output}`;
    if (output.includes("fx")) {
      payload = randomFromArray(effects);
    } else {
      const randomPixelIndex = Math.floor(Math.random() * 8) + 1;
      payload = `${randomPixelIndex}${randomColorHex()} ${randomPixelIndex}${randomColorHex()}`;
    }
    iras.push({
      topic,
      payload,
    });
  }
}

console.log(JSON.stringify(iras, null, 2));
fs.writeFileSync("mock-iras.json", JSON.stringify(iras, null, 2));
