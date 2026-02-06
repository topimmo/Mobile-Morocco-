# Quick Reference - Minimal Registration Fix

## TL;DR

**Problem**: Agent/merchant registration fails, user works.
**Root Cause**: Missing INSERT policy for authenticated users.
**Fix**: Add ONE RLS policy.

## Files

| File | Purpose | When to Use |
|------|---------|-------------|
| `20260127230000_diagnostic_registration_check.sql` | Identify root cause | Optional - if you want to verify |
| `20260127235000_minimal_fix_add_insert_policy.sql` | **THE FIX** | Required - apply this |
| `MINIMAL_FIX_README.md` | Deployment guide | Read first |
| `DIAGNOSTIC_GUIDE.md` | Diagnostic help | If diagnostic needed |
| `FINAL_SUMMARY.md` | Complete summary | Full details |

## Deploy in 3 Steps

### 1. Apply Fix
```bash
# Option A: CLI
supabase db push

# Option B: Dashboard
# Copy/paste: 20260127235000_minimal_fix_add_insert_policy.sql
# Into: SQL Editor → Run
```

### 2. Test
- Try registering as Technician (agent)
- Try registering as Store (merchant)
- Confirm both work

### 3. Done!
If works → ✅ Close issue
If fails → Run diagnostic, share error

## What the Fix Does

**Adds this policy**:
```sql
CREATE POLICY "users_insert_own_profile" ON profiles
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = id);
```

**Why it works**:
- Trigger normally creates profile with SECURITY DEFINER
- If trigger fails, this policy is the fallback
- Users can now create their own profile

## What the Fix Does NOT Do

❌ Change email columns
❌ Add placeholder emails
❌ Refactor existing RLS
❌ Modify trigger
❌ Add/remove columns

## Rollback

```sql
DROP POLICY IF EXISTS "users_insert_own_profile" ON profiles;
```

## Decision Tree

```
Registration fails for agent/merchant?
│
├─ Want to identify root cause first?
│  └─ Run diagnostic migration → See DIAGNOSTIC_GUIDE.md
│
└─ Just fix it?
   └─ Apply minimal fix → 20260127235000_minimal_fix_add_insert_policy.sql
      │
      ├─ Works? ✅ Done!
      │
      └─ Still fails?
         └─ Run diagnostic → Share results → Next minimal fix
```

## Support

- **Deployment help**: See `MINIMAL_FIX_README.md`
- **Diagnostic help**: See `DIAGNOSTIC_GUIDE.md`
- **Full details**: See `FINAL_SUMMARY.md`
- **Logs to check**: Supabase Dashboard → Logs → Postgres Logs

---

**Time to Deploy**: < 5 minutes
**Risk**: Very Low (only adds permissive policy)
**Impact**: Fixes agent/merchant registration
