import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";

const root = process.cwd();
const read = (path) => readFileSync(join(root, path), "utf8");

test("customer auth redirect helpers block unsafe paths and preserve checkout flow", () => {
  const authRedirect = read("src/services/authRedirect.service.ts");
  const customerGuard = read("src/guards/CustomerGuard.tsx");
  const authContext = read("src/contexts/AuthContext.tsx");
  const loginPage = read("src/pages/LoginPage.tsx");
  const adminGuard = read("src/admin/guards/AdminGuard.tsx");

  assert.match(authRedirect, /blockedRedirectPrefixes = \[.*"\/admin"/);
  assert.match(authRedirect, /session\.user\.role === "admin"/);
  assert.match(authRedirect, /Please sign in to continue checkout\./);
  assert.match(authRedirect, /Your session expired\. Please sign in again\./);
  assert.match(authRedirect, /markSessionExpired/);
  assert.match(authRedirect, /formatCustomerLoginError/);
  assert.match(authRedirect, /isInternalAuthErrorMessage/);

  assert.match(customerGuard, /resolveAuthRedirectReason/);
  assert.match(customerGuard, /buildLoginRedirectPath\(targetPath/);
  assert.match(customerGuard, /navigate\("\/admin"/);

  assert.match(authContext, /markSessionExpired/);
  assert.match(authContext, /voluntarySignOutRef/);
  assert.match(authContext, /role === "admin"/);

  assert.match(loginPage, /getCustomerAuthInfoMessage/);
  assert.match(loginPage, /formatCustomerLoginError/);

  assert.match(adminGuard, /!isAdmin/);
  assert.match(adminGuard, /profiles\.role is admin/);
});

test("checkout surfaces validation errors instead of only a generic failure", () => {
  const checkoutService = read("src/services/checkout.service.ts");
  const checkoutPage = read("src/pages/CheckoutPage.tsx");

  assert.match(checkoutService, /class CheckoutValidationError/);
  assert.match(checkoutService, /sanitizeOrderPersistenceError/);
  assert.match(checkoutPage, /toCheckoutErrorMessages/);
});
