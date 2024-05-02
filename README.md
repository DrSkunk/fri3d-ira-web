## Start NATS server

Go to `nats-server` folder and run `docker compose up -d` script. This will start:

- NATS server on port `4222`
- Websocket server on port `8443`
- Web interface on port `8222`, [http://localhost:8222/](http://localhost:8222/).

## Mock IRA updates

Run `npm run mock-ira-updates` to start sending mock IRA updates to NATS server.

## NATS API docs

Currently limitedly available here: https://github.com/area3001/ira_mpy/blob/main/README.md
