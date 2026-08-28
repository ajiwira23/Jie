# Pricing & Tax Audit — 2026-08-27

## Important
Public Codashop/UniPin prices are used only as retail reference snapshots. They are not supplier cost prices and are not claimed as live Aji Wira provider prices. Production pricing must be refreshed from the actual PPOB/game provider API before checkout.

## E-wallet tax treatment
The e-wallet storefront does not add a 10% markup or fictional national tax. The selected face value is the intended amount to be delivered to the customer. PPN, when legally applicable to a separate taxable service fee, must be calculated on that fee rather than deducted from the e-wallet principal. The current manual e-wallet flow therefore has no automatic service fee and no automatic PPN line; tax status must be configured and reviewed with the merchant's tax advisor before production.

## Payment gateway
Midtrans merchant fees are treated as payment-processing costs, not national taxes. The site must not blindly add a Midtrans fee to every product because the final payment channel and merchant pricing depend on the activated Midtrans configuration.

## Current reference snapshots
- Mobile Legends: UniPin public price snapshot: 12=Rp3.500, 28=Rp8.000, 56=Rp16.000, 85=Rp23.000, 169=Rp46.000, 220=Rp60.000.
- Free Fire MAX: UniPin public snapshot: 5=Rp1.000, 12=Rp2.000, 50=Rp8.000, 70=Rp10.000.
- PUBG Mobile UC: Codashop public snapshot: 60=Rp19.200, 325=Rp96.000, 660=Rp192.000, 1800=Rp480.000.
- Steam Wallet ID: UniPin lists denominations from Rp6.000 to Rp600.000; exact final price should be provider/channel driven.


## Demo pricing guard
Static face values for PPOB services are not accepted by the production order endpoint unless `ALLOW_DEMO_PRICING=true`. This prevents the storefront from charging a customer using guessed provider pricing.


## Checkout fee model implemented
- Application/Service Fee defaults to Rp2.000 and is configurable with `SERVICE_FEE_AMOUNT`.
- PPN on the service fee defaults to 11% (`SERVICE_FEE_VAT_RATE=0.11`), configurable for the merchant's applicable tax treatment.
- Midtrans processing fees are modeled per selected payment method. The public reference defaults are bank transfer Rp4.000; QRIS 0.7%; GoPay 2%; DANA 1.5%; OVO 1.5%; ShopeePay 2%; credit card 2.9% + Rp2.000; and selected cash/pay-later channels as configured. Midtrans states that gaming/digital-product merchants can have different rates, so production values should be overridden using `MIDTRANS_FEE_CONFIG_JSON`.
- Midtrans fee VAT defaults to 11% (`MIDTRANS_FEE_VAT_RATE=0.11`).
- Gross-up is calculated server-side so the merchant net reaches the product amount + service fee + service-fee VAT after modeled Midtrans fee and its VAT. The final `gross_amount` sent to Midtrans remains the authoritative checkout amount.
- The selected payment method is constrained in the Snap request with `enabled_payments`, so the method used for the gross-up matches the payment method presented to the customer.
- Existing order IDs, D1 `orders`/`payments` records, Midtrans signature verification, webhook state machine, and idempotency flow are preserved. Pricing details are stored inside `orders.input_json` rather than requiring a schema migration.
