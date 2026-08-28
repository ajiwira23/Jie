# Payment Architecture

Frontend -> `/api/orders` -> D1 internal order -> Midtrans Snap server-side -> user payment -> `/api/midtrans/notification` -> signature verification -> idempotent order transition -> provider fulfillment.

Do not treat redirect parameters as final payment proof.

Current provider is mock. Real fulfillment must be implemented only after supplier documentation/credentials are available.
