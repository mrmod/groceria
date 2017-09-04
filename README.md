## Groceria

Allows the NL-ish creation of a grocery list and the dispensation of its contents.

## Build and Run

```
npm install
functions deploy messenger --entry-point receiveText --trigger-http
```

## Feature Goals

* Add items to a grocery list using `Get $item` or `Pick up $item from CostCo`
* View list contents with `What did we need from CostCo?` or `I'm at Safeway`
* Join family members using OTP
* Remove list items with `Got $item` or `Picked up $item`

Features are tracked in [/issues]
