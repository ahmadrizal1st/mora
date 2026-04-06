**COMPLETE WEB ROUTES & DESCRIPTION**

---

**AUTH**
```
/sign-in                  = login with email & password
/sign-up                  = create new account
/forgot-password          = send reset link to email
/reset-password           = input new password via token
/sign-in-cover            = sign in page with cover image
/sign-in-illustration     = sign in page with illustration
/sign-in-link             = login via magic link without password
/2-step-verification      = choose verification method (SMS/TOTP)
/2-step-verification-code = input OTP code
/auth-lock                = lock screen for active session
```

**ERROR & SYSTEM**
```
/error-404          = page not found
/error-500          = internal server error
/error-403          = access denied / unauthorized
/error-429          = too many requests
/error-maintenance  = app under maintenance
```

**ONBOARDING**
```
/onboarding               = welcome & guided setup flow
/onboarding/profile       = fill name, photo, date of birth
/onboarding/risk-profile  = questionnaire to determine risk tolerance
/onboarding/goals         = select primary financial goals
/onboarding/connect-bank  = panduan import mutasi bank (MVP)
                          → upgrade ke Brick API (setelah growth)
```

**DASHBOARD**
```
/dashboard            = total assets summary, charts, latest notifications
/dashboard-crypto     = dedicated crypto portfolio dashboard
/dashboard-assets     = asset breakdown by category & percentage
/dashboard-risk       = risk score & rebalancing recommendation
/dashboard-analytics  = overview of all analytics data
```

**FINANCE TRACKER**
```
/tracker             = overview of all income & expense transactions
/tracker/input       = manual transaction input form
/tracker/photo       = capture receipt photo → AI reads & saves automatically
/tracker/voice       = record voice → AI transcribes & categorizes automatically
/tracker/history     = full transaction history with filter & search
/tracker/categories  = manage custom transaction categories
```

**MARKET & PRICE**
```
/market                = asset list, real-time prices, 24h changes
/market/watchlist      = monitored assets & active price alerts
/market/chart/:id      = technical chart per asset with MA/RSI/MACD indicators
/market/halal-screener = filter stocks & mutual funds by sharia criteria
/converter             = real-time currency & crypto converter
```

**PORTFOLIO**
```
/portfolio          = summary of all investment assets
/portfolio/compare  = compare 2–3 allocation scenario simulations
/portfolio/tax      = investment tax & capital gain estimation
/portfolio/dividend = dividend calendar & history per asset
```

**BUDGET**
```
/budget              = this month budget summary & progress per category
/budget/setup        = initial budget setup with 50/30/20 or custom method
/budget/transactions = all transactions within budget period
/budget/report       = monthly & yearly report with trend charts, export PDF
/budget/envelope     = digital envelope method per spending category
/budget/rollover     = leftover budget auto carries over to next month
```

**CREDIT & DEBT**
```
/credit                        = overview of all active debts & total summary
/credit/personal-loan          = active personal loan overview & tracker
/credit/personal-loan/simulator= simulate installment: amount, tenor, interest
/credit/personal-loan/compare  = compare personal loan products across banks
/credit/mortgage               = active mortgage overview & tracker
/credit/mortgage/simulator     = simulate mortgage: price, down payment, tenor
/credit/mortgage/compare       = compare mortgage products across banks
/credit/mortgage/early-payment = simulate early payoff & interest savings
/credit/cards                  = manage credit cards, limit, bills, due dates
/credit/paylater               = manage active paylater (Akulaku, Kredivo, etc)
/credit/score                  = credit score estimation & improvement tips
/credit/debt-planner           = debt payoff strategy (snowball vs avalanche)
/credit/history                = full loan & payment history
```

**GOALS & PLANNING**
```
/goals                  = list of active goals & each progress
/goals/calculator       = simple & compound interest calculator
/goals/emergency-fund   = emergency fund progress vs ideal target
/goals/retirement       = retirement simulation with inflation variables
/goals/insurance        = insurance tracking & recommendation
/goals/hajj-saving      = hajj fund simulation with cost increase estimation
```

**ANALYTICS & BEHAVIOR**
```
/analytics               = overview of all analytics data
/analytics/cashflow      = income vs expense cash flow per period
/analytics/networth      = historical net worth trend & projection
/analytics/subscription  = detect & manage active subscriptions
/behavior                = spending habit analysis by time & category
/behavior/triggers       = detect emotional spending patterns
/behavior/score          = financial health score 0–100 with breakdown
/benchmark               = compare spending vs average of similar income
/benchmark/savings-rate  = savings percentage vs ideal standard (50/30/20)
```

**SUBSCRIPTION TRACKER**
```
/subscription            = list of all active subscriptions
/subscription/add        = add subscription manually
/subscription/calendar   = billing due date calendar per subscription
/subscription/optimizer  = recommendation: keep or cancel each subscription
/subscription/history    = payment history per subscription
```

**SPLIT BILL**
```
/split          = list of all active shared bills
/split/create   = create new bill & add members
/split/:id      = bill detail: who pays what, settled status
/split/settle   = mark payment as settled & send reminder to friends
/split/history  = completed split bill history
```

**REMINDER**
```
/reminder           = list of all active reminders
/reminder/add       = create new reminder (bills, installments, tax, zakat)
/reminder/recurring = set automatic recurring reminders
/reminder/history   = completed reminder history
```

**AI & NEWS**
```
/ai            = AI financial advisor chatbot
/ai/autopilot  = auto categorize transactions & give weekly suggestions
/ai/forecast   = predict next month spending based on historical patterns
/ai/negotiate  = AI draft salary or price negotiation based on market data
/news          = financial news feed with auto article summary
/price-check   = input product name → check if price is fair or expensive
```

**LOCAL FEATURES**
```
/zakat         = zakat calculator for assets, income & gold
/tax           = income tax estimation & SPT filing deadline reminder
/nearby/atm    = find nearest ATM & bank with no admin fee
/nearby/promo  = nearby QRIS cashback & discount promos
```

**TOOLS & INTEGRATION**
```
/bank-sync     = connect bank account automatically (open banking)
/vault         = store important financial documents encrypted
/receipts      = scan receipt → auto transaction via OCR
/rules         = create automation rules for money management
/round-up      = transaction round-up automatically goes to goal
/salary-split  = auto split salary on arrival: needs, savings, investment
/journal       = daily financial notes with mood tracking
```

**EDUCATION**
```
/learn            = financial literacy articles & quizzes
/learn/simulator  = virtual investment without real money risk
/learn/path       = step-by-step financial literacy curriculum
```

**GAMIFICATION & SOCIAL**
```
/challenges    = weekly & monthly saving challenges
/achievements  = financial milestone badges & rewards
/leaderboard   = anonymous saving rank among users
/referral      = invite friends & earn rewards
/recap/weekly  = auto weekly summary via notification
```

**NOTIFICATION & ALERTS**
```
/notifications  = all incoming notifications center
/alerts         = manage price alerts & triggered alert history
```

**PROFILE & ACCOUNT**
```
/profile                   = user public profile
/profile/edit              = edit name, photo, bio
/settings                  = general preferences, currency & language
/settings/security         = password, 2FA, active sessions, activity log
/settings/notifications    = manage push & email notification preferences
/settings/family           = manage family members & access per member
/settings/widget           = configure mobile widget display
/settings/billing          = premium subscription & payment history
```

**ADMIN — USER MANAGEMENT**
```
/users          = all users list with search & filter (admin only)
/users/:id      = specific user detail & activity
/users/:id/edit = edit user data & status
/users/roles    = manage roles & permissions
```

---

**SUMMARY**

| Category | Routes |
|---|---|
| Auth | 10 |
| Error & System | 5 |
| Onboarding | 5 |
| Dashboard | 5 |
| Finance Tracker | 6 |
| Market & Price | 5 |
| Portfolio | 4 |
| Budget | 6 |
| Credit & Debt | 13 |
| Goals & Planning | 6 |
| Analytics & Behavior | 9 |
| Subscription Tracker | 5 |
| Split Bill | 5 |
| Reminder | 4 |
| AI & News | 6 |
| Local Features | 4 |
| Tools & Integration | 7 |
| Education | 3 |
| Gamification & Social | 5 |
| Notification & Alerts | 2 |
| Profile & Account | 8 |
| Admin | 4 |
| **Total** | **~137 routes** |