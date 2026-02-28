# Roomsy Frontend

React + Tailwind CSS hotel booking frontend for Roomsy.

## Setup

```bash
npm install
```

Create `.env`:
```
REACT_APP_API_URL=https://your-backend.vercel.app
```

```bash
npm start        # development
npm run build    # production build
```

## Pages
- `/` — Home (7 sections)
- `/hotels` — Browse & search hotels
- `/hotels/:id` — Hotel detail, rooms, reviews
- `/booking/:roomId` — 3-step booking (dates → guest info → confirm)
- `/payment` — Wallet top-up + SSLCommerz
- `/my-bookings` — User bookings with cancel
- `/profile` — User profile + quick deposit
- `/login` & `/register` — Auth pages
- `/dashboard` — Admin analytics

## Credentials
- Admin: admin@roomsy.com / Admin@123456
- User: user@roomsy.com / User@123456
