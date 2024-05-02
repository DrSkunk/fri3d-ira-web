import { connect, Msg, NatsConnection, NatsError } from "nats.ws";
import { useState, useEffect, useReducer, useCallback } from "react";

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

// TODO: Massage your data into a format that makes sense for your app.
type StateDefinition = {
  iras: Map<
    string,
    {
      effect: "rainbow" | "strobe" | "fade" | "solid" | "off";
      leds: Map<number, `#${string}`>;
    }
  >;
  error: NatsError | null;
};

type Actions =
  | { type: "NEW_MESSAGE"; payload: Msg }
  | { type: "NATS_ERROR"; error: NatsError };

function stateReducer(state: StateDefinition, action: Actions) {
  switch (action.type) {
    case "NEW_MESSAGE": {
      const id = action.payload.subject;
      const payload = action.payload.string();

      const iras = new Map(state.iras);
      const ira =
        iras.get(id) ||
        iras.set(id, { effect: "off", leds: new Map() }).get(id)!;

      // Effects
      if (
        payload === "rainbow" ||
        payload === "strobe" ||
        payload === "fade" ||
        payload === "solid" ||
        payload === "off"
      ) {
        ira.effect = payload;
      }

      // Leds
      else {
        // I actually have no idea what `2#de7656 2#28cce1` means. 😅
        for (let led of payload.split(" ")) {
          const [index, color] = led.split("#");
          ira.leds.set(Number(index), `#${color}`);
        }
      }

      return { ...state, iras, error: null };
    }

    case "NATS_ERROR": {
      return { ...state, error: action.error };
    }

    default:
      return state;
  }
}

export function useIras(subj: string) {
  const [state, dispatch] = useReducer(stateReducer, {
    iras: new Map(),
    error: null,
  } satisfies StateDefinition);

  useNatsSubscription(
    subj,
    useCallback((msg) => dispatch({ type: "NEW_MESSAGE", payload: msg }), []),
    useCallback((err) => dispatch({ type: "NATS_ERROR", error: err }), []),
  );

  return state;
}
