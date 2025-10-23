# Stage 1 

## Goal
- `server:add` add mcp server from a predefined collection in the source
- `client:add` add mcp client (e.g. cursor claude-code)
- `sync` generate config for clients

## config file (`mcpm.json`)
```json
{
    "servers": ["context7"],
    "clients": ["cursor", "claude-code"]
}