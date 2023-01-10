## Insphire client by Quantix

A library to use the insphire API.

### Installation and Usage

Installation:

```console
npm i @quantix-ict/insphire
```

Usage:

```javascript
const { Insphire } = require('@quantix-ict/insphire')

const insphire = new Insphire(
  'http://<HOST_IP>:8090/insphire.office', // BASE_URL of insphire installation.
  'USERNAME',
  'PASSWORD'
)

const contractitem = await insphire.request({
  endpoint: '/contractitems',
  params: {
    overrideshortages: true,
  },
  method: 'POST',
  payload: {
    ITEMNO: 'ALU220',
  },
  testmode: false,
  depot: '100',
})
```

of using import:

```javascript
import { Insphire } from '@quantix-ict/insphire'

const insphire = new Insphire(
  'http://<HOST_IP>:8090/insphire.office', // BASE_URL of insphire installation.
  'USERNAME',
  'PASSWORD'
)

const contractitem = await insphire.request({
  endpoint: '/contractitems',
  params: {
    overrideshortages: true,
  },
  method: 'POST',
  payload: {
    ITEMNO: 'ALU220',
  },
  testmode: false,
  depot: '100',
})
```
