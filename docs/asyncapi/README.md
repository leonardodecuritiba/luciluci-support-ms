# docs/asyncapi

Support does not have a specified business event during bootstrap S1.

`service-identity.json` records `capabilities.messaging=false`,
`defaultAsyncApiArtifact=null`, and no active exchange. Therefore, no
AsyncAPI contract or UI is published in this stage.

`scripts/check-asyncapi.js` and its compatibility comparator remain generic
validators for a future capability that is explicitly approved. When messaging
is activated, add a versioned contract, restore a CI gate, and run:

- `node scripts/check-asyncapi.js <contract.json>`
- `node scripts/check-asyncapi-backward-compatibility.js <baseline.json> <contract.json>`
