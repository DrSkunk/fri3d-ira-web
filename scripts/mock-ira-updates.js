import { connect } from "nats";
import iras from "./mock-iras.json" assert { type: "json" };

try {
  const nc = await connect({ servers: "localhost:4222" });
  console.log(`connected to ${nc.getServer()}`);
  // this promise indicates the client closed
  const done = nc.closed();
  // do something with the connection

  setInterval(() => {
    const { topic, payload } = iras[Math.floor(Math.random() * iras.length)];
    nc.publish(topic, payload);
    console.log(`published to ${topic} - ${payload}`);
  }, 200);
} catch (err) {
  console.log(`error connecting to server`);
}

// area3001.ira.default.devices.240ac4471ed0.output.0.rgb '8#ff0000 9#ff00ff'
// nats publish -s nats://demo.nats.io:4222 area3001.ira.default.devices.240ac4471ed0.output.0.rgb '8#ff0000 9#ff00ff'
