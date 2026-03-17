#!/bin/bash
# =============================================================
#  Stripe setup script for Tonvo
#  Creates products, prices, and configures webhook
#  Run: bash scripts/setup-stripe.sh
# =============================================================

set -e

echo ""
echo "========================================"
echo "  Tonvo - Stripe Setup"
echo "========================================"
echo ""

# Check Stripe CLI is logged in
if ! stripe config --list > /dev/null 2>&1; then
  echo "ERROR: Stripe CLI not logged in. Run 'stripe login' first."
  exit 1
fi

echo "[1/5] Fetching your Stripe secret key..."
# Get the secret key from Stripe CLI
STRIPE_SECRET_KEY=$(stripe config --list 2>/dev/null | grep -oP 'test_key\s*=\s*\K.*' || echo "")
if [ -z "$STRIPE_SECRET_KEY" ]; then
  echo "  -> Could not auto-detect key. You'll need to get it from https://dashboard.stripe.com/test/apikeys"
fi

echo "[2/5] Creating Pro product & price ($19/month)..."
PRO_PRODUCT=$(stripe products create \
  --name="Tonvo Pro" \
  --description="Unlimited sessions, AI coaching, screen analysis, full history" \
  2>/dev/null)
PRO_PRODUCT_ID=$(echo "$PRO_PRODUCT" | grep -oP '"id":\s*"\Kprod_[^"]+' | head -1)
echo "  -> Product: $PRO_PRODUCT_ID"

PRO_PRICE=$(stripe prices create \
  --product="$PRO_PRODUCT_ID" \
  --unit-amount=1900 \
  --currency=usd \
  --recurring-interval=month \
  2>/dev/null)
PRO_PRICE_ID=$(echo "$PRO_PRICE" | grep -oP '"id":\s*"\Kprice_[^"]+' | head -1)
echo "  -> Price: $PRO_PRICE_ID"

echo "[3/5] Creating Team product & price ($49/user/month)..."
TEAM_PRODUCT=$(stripe products create \
  --name="Tonvo Team" \
  --description="Everything in Pro + team dashboard, manager insights, priority onboarding" \
  2>/dev/null)
TEAM_PRODUCT_ID=$(echo "$TEAM_PRODUCT" | grep -oP '"id":\s*"\Kprod_[^"]+' | head -1)
echo "  -> Product: $TEAM_PRODUCT_ID"

TEAM_PRICE=$(stripe prices create \
  --product="$TEAM_PRODUCT_ID" \
  --unit-amount=4900 \
  --currency=usd \
  --recurring-interval=month \
  2>/dev/null)
TEAM_PRICE_ID=$(echo "$TEAM_PRICE" | grep -oP '"id":\s*"\Kprice_[^"]+' | head -1)
echo "  -> Price: $TEAM_PRICE_ID"

echo "[4/5] Configuring customer portal..."
stripe billing_portal configurations create \
  --features-subscription-cancel-enabled=true \
  --features-subscription-update-enabled=true \
  --features-payment-method-update-enabled=true \
  --business-profile-headline="Manage your Tonvo subscription" \
  > /dev/null 2>&1 || echo "  -> Portal config may already exist (OK)"

echo "[5/5] Writing keys to .env.local..."

# Get publishable key
STRIPE_PK=$(stripe config --list 2>/dev/null | grep -oP 'publishable_key\s*=\s*\K.*' || echo "")

# Append Stripe keys to .env.local
cat >> .env.local << ENVEOF

# Stripe
STRIPE_SECRET_KEY=${STRIPE_SECRET_KEY}
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=${STRIPE_PK}
STRIPE_PRO_PRICE_ID=${PRO_PRICE_ID}
STRIPE_TEAM_PRICE_ID=${TEAM_PRICE_ID}
STRIPE_WEBHOOK_SECRET=whsec_PLACEHOLDER
ENVEOF

echo ""
echo "========================================"
echo "  DONE! Products created on Stripe."
echo "========================================"
echo ""
echo "Products:"
echo "  Pro:  $PRO_PRODUCT_ID -> $PRO_PRICE_ID (\$19/mo)"
echo "  Team: $TEAM_PRODUCT_ID -> $TEAM_PRICE_ID (\$49/mo)"
echo ""
echo "NEXT STEPS:"
echo ""
echo "  1. Get your secret key from https://dashboard.stripe.com/test/apikeys"
echo "     and replace STRIPE_SECRET_KEY in .env.local"
echo ""
echo "  2. Start webhook forwarding (run in separate terminal):"
echo "     stripe listen --forward-to localhost:3000/api/stripe/webhook"
echo ""
echo "  3. Copy the webhook signing secret (whsec_...) it prints"
echo "     and replace STRIPE_WEBHOOK_SECRET in .env.local"
echo ""
echo "  4. Restart your dev server: npm run dev"
echo ""
