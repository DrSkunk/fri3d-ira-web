import { connect, Msg, NatsConnection, NatsError } from "nats.ws";
import { useState, useEffect } from "react";

export const natsClientPromise = connect({ servers: "ws://localhost:8443" });

export function useNats() {
  const [nats, setNats] = useState<NatsConnection | null>(null);

  useEffect(() => {
    if (nats) return;

    natsClientPromise
      .then((nc) => setNats(nc))
      .catch((err) => console.error("connect failed", err));
  }, [nats]);

  return nats;
}

type SuccessCallback = (msg: Msg) => Promise<void>;

export function useNatsSubscription(subj: string, onMessage: SuccessCallback) {
  const nc = useNats();
  useEffect(() => {
    if (!nc) return;
    const sub = nc.subscribe(subj, {
      callback: function (err: NatsError | null, msg: Msg) {
        if (err) {
          console.error(err);
        } else {
          onMessage(msg);
        }
      },
    });
    return () => {
      sub.unsubscribe();
    };
  }, [nc]);
}
