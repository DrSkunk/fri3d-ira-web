import { connect, StringCodec } from "nats";

const sc = StringCodec();

async function printMsgs(s) {
  let subj = s.getSubject();
  console.log(`listening for ${subj}`);
  const c = 13 - subj.length;
  const pad = "".padEnd(c);
  for await (const m of s) {
    console.log(
      `[${subj}]${pad} #${s.getProcessed()} - ${m.subject} ${
        m.data ? " " + sc.decode(m.data) : ""
      }`
    );
  }
}

try {
  const nc = await connect({ servers: "localhost:4222" });
  console.log(`connected to ${nc.getServer()}`);
  // this promise indicates the client closed
  const done = nc.closed();
  // do something with the connection
  const s1 = nc.subscribe("area3001.ira.>");
  printMsgs(s1);
} catch (err) {
  console.log(`error connecting to server`);
}
