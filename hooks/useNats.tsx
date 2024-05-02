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

export function useNatsSubscription(
  subj: string,
  onMessage: (msg: Msg) => void,
  onError: (err: NatsError) => void,
) {
  const nc = useNats();

  useEffect(() => {
    if (!nc) return;

    const sub = nc.subscribe(subj, {
      callback: function (err: NatsError | null, msg: Msg) {
        if (err) {
          onError?.(err);
        } else {
          onMessage(msg);
        }
      },
    });

    return () => sub.unsubscribe();
  }, [nc, onError, onMessage, subj]);
}

}
