# Demonstration credit purchases

This branch connects account credit purchases to the test-only backend feature
in `Renaper-PAD-worktrees/mercado-pago-demo`, branch `feat/mercado-pago-demo`.
No deployment is part of this implementation. The backend must have SQL004/005
and test-seller configuration before checkout is available.

## Flow

1. Register and log in through this web app; consumer systems only need API keys.
2. Open the account credit panel: 1000 queries cost fictitious ARS1000.
3. Prepare a checkout, then follow the exact sandbox checkout link. Never use a
   real card or real buyer account. Official test-card instructions are in the
   authenticated integration documentation.
4. Return to the account and refresh the authoritative server balance. A return
   URL such as `?status=approved` never changes the displayed balance by itself.

## Checks

Run `npm test` and `npm run build`. Credit panel tests cover disabled checkout,
safe redirects, failed purchases, balance refresh, and untrusted return flags.
Real provider acceptance (including its test Webhook delivery) needs the private
operator configuration and an explicitly authorized deployment.
