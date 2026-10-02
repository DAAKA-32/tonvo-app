import { describe, it, expect } from "vitest";
import { NAME_CONSENT_KEY, consentedFirstName, toSubscriptionEvent } from "./stripe-mapping";

type SubscriptionInput = Parameters<typeof toSubscriptionEvent>[0];
type CustomerInput = Parameters<typeof consentedFirstName>[0];

const PRICES = { price_closer_m: "pro", price_closer_y: "pro", price_team_m: "team" } as const;

function customer(name: string | null, consent: boolean): CustomerInput {
  return { id: "cus_123", object: "customer", name, metadata: consent ? { [NAME_CONSENT_KEY]: "true" } : {} } as unknown as CustomerInput;
}

function sub(priceId: string, cust: CustomerInput = "cus_123", created = 1_790_000_000): SubscriptionInput {
  return { id: "sub_1Q2w3E4r5T6y", created, customer: cust, items: { data: [{ price: { id: priceId } }] } } as unknown as SubscriptionInput;
}

describe("toSubscriptionEvent", () => {
  it("maps a known price to its plan", () => {
    const e = toSubscriptionEvent(sub("price_team_m"), PRICES);
    expect(e?.planId).toBe("team");
    expect(e?.source).toBe("stripe");
    expect(e?.createdAt).toBe(new Date(1_790_000_000 * 1000).toISOString());
  });

  it("skips prices that are not a Tonvo plan", () => {
    expect(toSubscriptionEvent(sub("price_unknown"), PRICES)).toBeNull();
  });

  it("does not expose the Stripe subscription id", () => {
    const e = toSubscriptionEvent(sub("price_closer_m"), PRICES);
    expect(e?.id).not.toContain("sub_");
    expect(e?.id).toBe(toSubscriptionEvent(sub("price_closer_y"), PRICES)?.id);
  });

  it("stays anonymous unless the customer consented", () => {
    expect(toSubscriptionEvent(sub("price_closer_m"), PRICES)?.displayName).toBeNull();
    expect(toSubscriptionEvent(sub("price_closer_m", customer("Jane Doe", false)), PRICES)?.displayName).toBeNull();
    expect(toSubscriptionEvent(sub("price_closer_m", customer("jane doe", true)), PRICES)?.displayName).toBe("Jane");
  });
});

describe("consentedFirstName", () => {
  it("rejects deleted customers and odd names", () => {
    expect(consentedFirstName({ id: "cus_1", object: "customer", deleted: true } as unknown as CustomerInput)).toBeNull();
    expect(consentedFirstName(customer("<script>", true))).toBeNull();
    expect(consentedFirstName(customer(null, true))).toBeNull();
    expect(consentedFirstName(customer("Zoé-Anne Martin", true))).toBe("Zoé-Anne");
  });
});
