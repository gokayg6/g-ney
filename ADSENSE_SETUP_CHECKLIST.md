# AdSense Setup Checklist ✅

Use this checklist to complete your AdSense integration.

---

## 🎯 Phase 1: Get AdSense Approved (If Not Already)

- [ ] Sign up at [Google AdSense](https://www.google.com/adsense/)
- [ ] Submit your website for review
- [ ] Wait for approval (can take 1-2 weeks)
- [ ] Receive approval email with account activation

**Current Status:** ✅ AdSense script already integrated with client ID `ca-pub-5956124359067452`

---

## 🔧 Phase 2: Create Ad Units

### Required Ad Units

Create these ad units in your AdSense dashboard:

#### 1. Blog List Top Banner
- [ ] Go to AdSense → Ads → Ad units → **Create new ad unit**
- [ ] Type: **Display ad**
- [ ] Name: "Blog List Top Banner"
- [ ] Ad size: **Responsive**
- [ ] Copy the `data-ad-slot` value (e.g., "1234567890")
- [ ] Paste into `lib/adsense-config.ts` → `SLOTS.BLOG_LIST_TOP`

#### 2. Blog List Inline
- [ ] Create new ad unit
- [ ] Type: **In-article ad**
- [ ] Name: "Blog List Inline"
- [ ] Copy `data-ad-slot` value
- [ ] Paste into `lib/adsense-config.ts` → `SLOTS.BLOG_LIST_INLINE`

#### 3. Blog Detail Top
- [ ] Create new ad unit
- [ ] Type: **Display ad** (Horizontal)
- [ ] Name: "Blog Detail Top"
- [ ] Copy `data-ad-slot` value
- [ ] Paste into `lib/adsense-config.ts` → `SLOTS.BLOG_DETAIL_TOP`

#### 4. Blog Detail Inline
- [ ] Create new ad unit
- [ ] Type: **In-article ad**
- [ ] Name: "Blog Detail Inline"
- [ ] Copy `data-ad-slot` value
- [ ] Paste into `lib/adsense-config.ts` → `SLOTS.BLOG_DETAIL_INLINE`

#### 5. Blog Detail Bottom
- [ ] Create new ad unit
- [ ] Type: **Display ad** (Responsive)
- [ ] Name: "Blog Detail Bottom"
- [ ] Copy `data-ad-slot` value
- [ ] Paste into `lib/adsense-config.ts` → `SLOTS.BLOG_DETAIL_BOTTOM`

---

## ⚙️ Phase 3: Configure Environment

- [ ] Create `.env.local` file in project root
- [ ] Add: `NEXT_PUBLIC_ADSENSE_ENABLED=true`
- [ ] (Optional) Add: `NEXT_PUBLIC_ADSENSE_DEV=true` for testing in dev mode
- [ ] Restart dev server: `npm run dev`

---

## 🧪 Phase 4: Test Locally

- [ ] Run: `npm run dev`
- [ ] Visit: `http://localhost:3000/blog`
- [ ] Open DevTools → Console
- [ ] Look for: `[AdSense] Ad loaded: slot XXXXXX`
- [ ] Check that ads don't break layout (use testMode if needed)

### Test Mode (Visual Testing)

If you want to see ad placeholders during development:

```tsx
<AdSenseAd slot="1234567890" testMode={true} />
```

---

## 🚀 Phase 5: Deploy to Production

- [ ] Commit all changes
- [ ] Push to repository
- [ ] Deploy to production (Vercel, Netlify, etc.)
- [ ] Wait 10-30 minutes for ads to start showing
- [ ] Verify ads appear on live site

### Deployment Commands

```bash
git add .
git commit -m "Add Google AdSense integration"
git push origin main
```

---

## 📊 Phase 6: Monitor & Verify

### Day 1
- [ ] Check AdSense dashboard for impressions
- [ ] Verify ads display on blog pages
- [ ] Test on mobile devices
- [ ] Check page load speed (should be unaffected)

### Week 1
- [ ] Review click-through rate (CTR)
- [ ] Check for policy violations
- [ ] Monitor user feedback
- [ ] Adjust placement if needed

### Month 1
- [ ] Review revenue data
- [ ] Optimize ad positions based on performance
- [ ] Consider A/B testing different placements

---

## 🎨 Optional: Enable Subdomain Ads (Future)

When ready to enable ads on project subdomains:

### For Mobile App Projects
- [ ] Create ad units in AdSense for mobile app subdomains
- [ ] Update `lib/adsense-config.ts`:
  ```typescript
  MOBILE_APP: { enabled: true, headerAdEnabled: true, contentAdEnabled: true }
  ```
- [ ] Update slot IDs for mobile app ads
- [ ] Deploy and test

### For Other Subdomains
Repeat above steps for:
- [ ] Game projects
- [ ] Website projects
- [ ] E-Commerce projects
- [ ] SaaS projects

**Note:** See `components/templates/SubdomainTemplateExample.tsx` for implementation examples.

---

## ⚠️ Important Reminders

### AdSense Policy Compliance
- [ ] Don't click your own ads
- [ ] Don't encourage users to click ads
- [ ] Don't place ads on prohibited content
- [ ] Review [AdSense Program Policies](https://support.google.com/adsense/answer/48182)

### Performance Best Practices
- [ ] Limit to 3-4 ads per page
- [ ] Use responsive ad formats
- [ ] Monitor Core Web Vitals
- [ ] Test on slow connections

### User Experience
- [ ] Ads don't disrupt reading flow
- [ ] Clear visual distinction from content
- [ ] Mobile-friendly placement
- [ ] Site usable with ad blockers

---

## 📞 Need Help?

### Common Issues

**Ads not showing?**
- Wait 24-48 hours after creating ad units
- Check environment variable: `NEXT_PUBLIC_ADSENSE_ENABLED=true`
- Verify slot IDs are correct
- Check browser console for errors

**Layout broken?**
- Wrap ads in fixed-height containers
- Use responsive ad formats
- Test on different screen sizes

**Console errors?**
- Check AdSense script is loaded
- Verify slot IDs match AdSense dashboard
- Ensure components are client components (`"use client"`)

### Resources

- **Quick Start:** `ADSENSE_QUICK_START.md`
- **Full Docs:** `ADSENSE_INTEGRATION.md`
- **Implementation Details:** `ADSENSE_IMPLEMENTATION_SUMMARY.md`
- **AdSense Help:** https://support.google.com/adsense

---

## ✅ Completion Status

Track your progress:

- [ ] Phase 1: AdSense account approved
- [ ] Phase 2: Ad units created and configured
- [ ] Phase 3: Environment variables set
- [ ] Phase 4: Tested locally
- [ ] Phase 5: Deployed to production
- [ ] Phase 6: Monitoring and optimization started

**When all phases are complete:** 🎉 Your AdSense integration is live and earning!

---

**Last Updated:** November 15, 2025

