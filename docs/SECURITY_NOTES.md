# Supabase Security Linter — Status Notes

Last reviewed: 2026-05-15

## Summary
- **Critical (ERROR)**: 0 ✅
- **WARN (accepted)**: 13 — all listed below with justification.

The remaining warnings are intentional and accepted. Each one is documented so
future audits know they were not overlooked.

---

## WARN 0014 — Extension in `public` schema (`pg_net`)
- **Why kept**: `pg_net` is required by `notify_role_change` and
  `request_admin_access` to perform best-effort outbound HTTP to our edge
  functions (`notify-role-change`). Supabase installs `pg_net` in `public` by
  default and moving it across schemas requires DB owner privileges that are
  not exposed in Lovable Cloud.
- **Mitigation**: All `net.http_post` calls happen inside `SECURITY DEFINER`
  functions wrapped in `EXCEPTION WHEN OTHERS THEN NULL`, so a failure cannot
  block role/access changes.

## WARN 0028 — Public can EXECUTE SECURITY DEFINER (3 functions)
Functions intentionally exposed to anonymous users (checkout / public flows):

| Function | Reason |
|---|---|
| `validate_coupon(text, numeric)` | Used by the public cart to validate coupon codes before checkout. Read-only and rate-limited by the cart UX. |
| `create_order_with_items(jsonb, jsonb)` | Public checkout entry point — guests must be able to create orders. Validates payload, enforces field length, validates coupon atomically with `FOR UPDATE`. |
| `update_updated_at_column()` | Generic trigger helper, only callable as a trigger. Anon EXECUTE is harmless because invocation outside a trigger context returns `NEW` with no side effects. |

## WARN 0029 — Authenticated users can EXECUTE SECURITY DEFINER (9 functions)
All of these enforce role checks (`has_role(auth.uid(), 'admin')`) or operate
strictly on the calling user’s own row. Granting `EXECUTE` to `authenticated`
is required because the role check happens *inside* the function:

| Function | Internal guard |
|---|---|
| `has_role(uuid, app_role)` | Pure read of `user_roles`; needed by RLS policies and admin UI. |
| `promote_user_to_admin(text)` | Requires caller to be admin. Audited. |
| `reject_admin_request(uuid, text)` | Requires caller to be admin. Audited. |
| `apply_default_weight(numeric)` | Requires caller to be admin. |
| `request_admin_access()` | Operates on `auth.uid()` only. Rate-limited (24h) + pending check. |
| `check_resend_email_cooldown(uuid)` | Requires caller to be admin. Enforces 60s cooldown + 10/hour. |
| `tracking_email_log_set_actor()` | Trigger-only helper that fills `triggered_by` with `auth.uid()`. |
| `audit_role_revocation()` | Trigger-only auditor. |
| `notify_role_change()` | Trigger-only notifier. |
| `record_coupon_use()` | Trigger-only side-effect on order insert. |
| `auto_create_redirect_on_slug_change()` | Trigger-only redirect bookkeeping. |
| `enforce_product_weight_on_insert()` | Trigger-only validation. |
| `handle_new_user()` | Trigger on `auth.users` insert. |

Trigger-only functions cannot be moved to `SECURITY INVOKER` because they need
to write to tables that the inserting user has no direct privileges on (audit,
profiles, redirects). Direct `EXECUTE` of these functions outside a trigger is
a no-op.

---

## Re-running the linter
```bash
# from the agent
supabase--linter
```
Expected: **0 ERRORs**, ≤13 WARNs that match the table above. Any new WARN
should be triaged here before being accepted.
