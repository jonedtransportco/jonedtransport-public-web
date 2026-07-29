export type PublicIntakeDomain = "drivers" | "owner-operators";
export type PublicIntakeMode = "mock" | "api-real";

type PublicIntakeSelection = {
  mode: PublicIntakeMode;
  reason: string;
  reviewEnabled: boolean;
};

const reviewEligibleDomains: PublicIntakeDomain[] = ["drivers"];

export function resolvePublicIntakeMode(
  domain: PublicIntakeDomain,
  globalMode: PublicIntakeMode,
  domainMode: PublicIntakeMode,
): PublicIntakeSelection {
  const reviewEnabled =
    reviewEligibleDomains.includes(domain) &&
    globalMode === "api-real" &&
    domainMode === "api-real";

  if (!reviewEligibleDomains.includes(domain)) {
    return {
      mode: "mock",
      reason: "Domain is not approved for review-environment api-real preparation.",
      reviewEnabled: false,
    };
  }

  if (reviewEnabled) {
    return {
      mode: "api-real",
      reason: "Drivers is the only public intake domain reserved for future review-environment api-real activation.",
      reviewEnabled: true,
    };
  }

  return {
    mode: "mock",
    reason: "Mock mode remains active until explicit review-environment activation is approved and configured.",
    reviewEnabled: false,
  };
}

export const publicIntakeSwitchStrategy =
  "env-flag-plus-domain-allowlist-plus-contract-parity-checks-plus-mock-fallback";

export const publicIntakeReviewEnv = {
  globalFlag: "PUBLIC_INTAKE_API_MODE",
  driversFlag: "PUBLIC_INTAKE_DRIVERS_SOURCE",
  ownerOperatorsFlag: "PUBLIC_INTAKE_OWNER_OPERATORS_SOURCE",
  driversEndpoint: "PUBLIC_INTAKE_DRIVERS_API_URL",
  ownerOperatorsEndpoint: "PUBLIC_INTAKE_OWNER_OPERATORS_API_URL",
};
