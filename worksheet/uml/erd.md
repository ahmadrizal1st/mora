Berikut list lengkap perubahan dari database awal:

---

## Tabel Baru (Ditambahkan)

**Users & Auth**
- `family_members`

**Cashflow**
- `account_balances`
- `subscriptions`
- `split_bills`
- `split_participants`
- `reminders`
- `automation_rules`
- `round_up_configs`
- `salary_split_configs`

**Wealth**
- `assets`
- `asset_price_history`
- `portfolios`
- `watchlists`
- `dividend_events`

**Credit**
- `credit_schedules`

**Planning**
- `goals`
- `insurance_policies`
- `zakat_calculations`

**Gamification**
- `gamification_profiles`
- `streaks`
- `quests`
- `user_quests`
- `badges`
- `user_badges`
- `challenges`
- `challenge_participants`
- `referrals`
- `reward_items`
- `reward_redemptions`
- `leaderboard_snapshots`
- `weekly_recaps`
- `shareable_cards`

**Ecosystem**
- `vault_documents`
- `news_preferences`
- `learning_progress`

---

## Tabel Diganti Nama

| Sebelum | Sesudah |
|---|---|
| `documents` | `document_extractions` |
| `credits` | `credit_accounts` |

---

## Tabel Dimodifikasi (Kolom Baru / Rename)

**`user_settings`**
- Tambah `notification_preferences` JSON

**`accounts`**
- Rename `type` → `account_type`
- Tambah `updated_at`

**`transactions`**
- Rename `rate_snapshot` → `exchange_rate`
- Rename `tracker` → `input_method`
- Tambah `document_extraction_id FK`
- Tambah `split_bill_id FK`
- Tambah `updated_at`

**`budget_plans`**
- Rename `method` → `budget_method`
- Rename `duration` → `period`
- Tambah `rollover_enabled`

**`document_extractions`** *(ex `documents`)*
- Rename `doc_type` → `document_type`
- Rename `extracted_data` → `parsed_data`

**`credit_accounts`** *(ex `credits`)*
- Tambah `user_id FK`
- Tambah `type`
- Tambah `provider_name`
- Tambah `principal_amount_raw`
- Tambah `interest_rate`
- Tambah `duration_months`
- Rename `limit` → `credit_limit`
- Rename `total_amount` → `amount`
- Rename `installment_amount` → `monthly_installment`
- Tambah `start_date`
- Tambah `updated_at`

---

## Relasi Baru

- `users` → `family_members`
- `users` → `subscriptions`
- `users` → `split_bills`
- `users` → `reminders`
- `users` → `automation_rules`
- `users` → `round_up_configs`
- `users` → `salary_split_configs`
- `users` → `portfolios`
- `users` → `watchlists`
- `users` → `credit_accounts`
- `users` → `goals`
- `users` → `insurance_policies`
- `users` → `zakat_calculations`
- `users` → `gamification_profiles`
- `users` → `streaks`
- `users` → `user_quests`
- `users` → `user_badges`
- `users` → `challenge_participants`
- `users` → `referrals`
- `users` → `reward_redemptions`
- `users` → `leaderboard_snapshots`
- `users` → `weekly_recaps`
- `users` → `shareable_cards`
- `users` → `vault_documents`
- `users` → `news_preferences`
- `users` → `learning_progress`
- `accounts` → `account_balances`
- `assets` → `portfolios`
- `assets` → `watchlists`
- `assets` → `asset_price_history`
- `assets` → `dividend_events`
- `credit_accounts` → `credit_schedules`
- `goals` → `round_up_configs`
- `quests` → `user_quests`
- `badges` → `user_badges`
- `challenges` → `challenge_participants`
- `reward_items` → `reward_redemptions`
- `zakat_calculations` → `transactions`
- `credit_schedules` → `transactions`
- `transactions` → `split_bills`
- `transactions` → `document_extractions`


```mermaid
erDiagram
  %% ==========================================
  %% USERS & AUTH
  %% ==========================================
  users {
    UUID id PK
    STRING name
    STRING email
    TIMESTAMP email_verified_at
    STRING password
    STRING remember_token
    STRING role
    STRING google_id
    TIMESTAMP created_at
    TIMESTAMP updated_at
  }
  otp_codes {
    UUID id PK
    STRING email
    STRING code
    TIMESTAMP expires_at
    TIMESTAMP created_at
    TIMESTAMP updated_at
  }
  user_settings {
    UUID id PK
    UUID user_id FK
    STRING base_currency
    BOOLEAN is_family_mode
    STRING theme
    JSON notification_preferences
    TIMESTAMP created_at
    TIMESTAMP updated_at
  }
  notifications {
    UUID id PK
    STRING type
    STRING notifiable_type
    BIGINT notifiable_id
    TEXT data
    TIMESTAMP read_at
    BOOLEAN is_starred
    STRING label
    TIMESTAMP created_at
    TIMESTAMP updated_at
  }
  family_members {
    UUID id PK
    BIGINT owner_user_id FK
    BIGINT member_user_id FK
    STRING role
    BOOLEAN can_view_transactions
    BOOLEAN can_add_transactions
    TIMESTAMP created_at
    TIMESTAMP updated_at
  }

  %% ==========================================
  %% CORE CASHFLOW
  %% ==========================================
  currencies {
    UUID id PK
    STRING code
    STRING name
    STRING symbol
  }
  accounts {
    UUID id PK
    UUID user_id FK
    STRING name
    UUID currency_id FK
    STRING color
    STRING account_type "cash/bank/e-wallet/investment"
    TIMESTAMP created_at
    TIMESTAMP updated_at
  }
  account_balances {
    UUID id PK
    UUID account_id FK
    DATE period_month
    BIGINT balance_raw
    FLOAT balance_in_default
    TIMESTAMP updated_at
  }
  categories {
    UUID id PK
    UUID user_id FK "nullable"
    UUID parent_id FK "nullable"
    STRING name
    STRING type "income/expense"
    STRING icon
    STRING color
    TIMESTAMP created_at
    TIMESTAMP updated_at
  }
  tags {
    UUID id PK
    UUID user_id FK
    STRING name
    STRING color
    TIMESTAMP created_at
    TIMESTAMP updated_at
  }
  statuses {
    UUID id PK
    STRING name
    STRING color
  }
  recurring_types {
    UUID id PK
    STRING name
  }

  %% ==========================================
  %% TRANSACTIONS
  %% ==========================================
  transactions {
    UUID id PK
    UUID user_id FK
    STRING type "income/expense/transfer"
    BIGINT amount_raw
    UUID currency_id FK
    FLOAT exchange_rate
    FLOAT amount_in_default
    UUID account_id FK
    BIGINT to_account_id FK "nullable"
    UUID category_id FK "nullable"
    UUID status_id FK "nullable"
    UUID recurring_type_id FK "nullable"
    UUID budget_item_id FK "nullable"
    UUID document_extraction_id FK "nullable"
    UUID split_bill_id FK "nullable"
    DATE tx_date
    STRING input_method "manual/voice/receipt/autopilot"
    STRING merchant "nullable"
    TEXT notes "nullable"
    JSON dynamic_fields "nullable"
    TIMESTAMP created_at
    TIMESTAMP updated_at
  }
  transaction_tags {
    UUID transaction_id FK
    UUID tag_id FK
  }

  %% ==========================================
  %% BUDGETING
  %% ==========================================
  budget_plans {
    UUID id PK
    UUID user_id FK
    STRING name
    STRING budget_method "50_30_20/custom/zero_based/envelope"
    DECIMAL income_baseline
    STRING period "monthly/yearly"
    BOOLEAN is_active
    BOOLEAN rollover_enabled
    DATE start_date
    DATE end_date
    TIMESTAMP created_at
    TIMESTAMP updated_at
  }
  budget_items {
    UUID id PK
    UUID budget_plan_id FK
    STRING name
    DECIMAL percentage
    DECIMAL amount_limit
    STRING color
    STRING icon
    TIMESTAMP created_at
    TIMESTAMP updated_at
  }
  budget_item_categories {
    UUID id PK
    UUID budget_item_id FK
    UUID category_id FK
    TIMESTAMP created_at
    TIMESTAMP updated_at
  }

  %% ==========================================
  %% SUBSCRIPTIONS
  %% ==========================================
  subscriptions {
    UUID id PK
    UUID user_id FK
    UUID account_id FK
    BIGINT last_transaction_id FK "nullable"
    STRING name
    BIGINT amount_raw
    UUID currency_id FK
    DATE next_billing_date
    BOOLEAN auto_renew
    STRING billing_cycle "monthly/yearly/weekly"
    TIMESTAMP created_at
    TIMESTAMP updated_at
  }

  %% ==========================================
  %% SPLIT BILL
  %% ==========================================
  split_bills {
    UUID id PK
    UUID user_id FK
    UUID transaction_id FK "nullable"
    STRING title
    BIGINT total_amount_raw
    UUID currency_id FK
    STRING status "open/settled"
    TIMESTAMP created_at
    TIMESTAMP updated_at
  }
  split_participants {
    UUID id PK
    UUID split_bill_id FK
    UUID user_id FK "nullable"
    STRING participant_name "nullable"
    BIGINT share_amount_raw
    BOOLEAN is_settled
    TIMESTAMP settled_at "nullable"
    TIMESTAMP created_at
    TIMESTAMP updated_at
  }

  %% ==========================================
  %% REMINDERS & AUTOMATION
  %% ==========================================
  reminders {
    UUID id PK
    UUID user_id FK
    STRING entity_type "credit/subscription/goal/zakat"
    BIGINT entity_id
    DATE due_date
    JSON notify_schedule
    BOOLEAN is_sent
    TIMESTAMP created_at
    TIMESTAMP updated_at
  }
  automation_rules {
    UUID id PK
    UUID user_id FK
    STRING name
    STRING trigger_type
    JSON condition
    JSON action
    BOOLEAN is_active
    TIMESTAMP last_triggered_at "nullable"
    TIMESTAMP created_at
    TIMESTAMP updated_at
  }
  round_up_configs {
    UUID id PK
    UUID user_id FK
    UUID account_id FK
    UUID goal_id FK
    STRING round_to "100/1000/10000"
    BOOLEAN is_active
    TIMESTAMP created_at
    TIMESTAMP updated_at
  }
  salary_split_configs {
    UUID id PK
    UUID user_id FK
    BIGINT source_account_id FK
    JSON allocations
    BOOLEAN is_active
    TIMESTAMP created_at
    TIMESTAMP updated_at
  }

  %% ==========================================
  %% AI & DOCUMENT EXTRACTIONS
  %% ==========================================
  document_extractions {
    UUID id PK
    UUID user_id FK "nullable"
    UUID transaction_id FK "nullable"
    STRING document_type "receipt/policy/salary_slip/npwp/certificate"
    STRING file_path
    STRING mime_type
    STRING original_filename
    TEXT raw_text
    JSON parsed_data
    STRING status "pending/processed/failed"
    TEXT error_message "nullable"
    TIMESTAMP created_at
    TIMESTAMP updated_at
  }
  llm_providers {
    UUID id PK
    UUID user_id FK "nullable"
    BOOLEAN is_default
    STRING name
    STRING base_url
    TEXT api_key
    STRING auth_type
    TEXT headers
    JSON payload_template
    STRING response_path
    STRING default_model
    BOOLEAN is_active
    INT priority
    TIMESTAMP last_rotated_at "nullable"
    TIMESTAMP created_at
    TIMESTAMP updated_at
  }

  %% ==========================================
  %% WEALTH
  %% ==========================================
  assets {
    UUID id PK
    STRING ticker
    STRING name
    STRING type "stock/crypto/mutual_fund/gold/bond"
    BOOLEAN is_halal
    STRING esg_rating "nullable"
    TIMESTAMP created_at
    TIMESTAMP updated_at
  }
  asset_price_history {
    UUID id PK
    UUID asset_id FK
    DATE price_date
    BIGINT close_price_raw
    BIGINT open_price_raw
    BIGINT high_price_raw
    BIGINT low_price_raw
    UUID currency_id FK
    TIMESTAMP created_at
  }
  portfolios {
    UUID id PK
    UUID user_id FK
    UUID asset_id FK
    UUID account_id FK "nullable"
    FLOAT quantity
    BIGINT average_buy_price_raw
    UUID currency_id FK
    TIMESTAMP created_at
    TIMESTAMP updated_at
  }
  watchlists {
    UUID id PK
    UUID user_id FK
    UUID asset_id FK
    BIGINT alert_price_low_raw "nullable"
    BIGINT alert_price_high_raw "nullable"
    BOOLEAN alert_enabled
    TIMESTAMP created_at
    TIMESTAMP updated_at
  }
  dividend_events {
    UUID id PK
    UUID asset_id FK
    DATE ex_date
    DATE pay_date
    BIGINT amount_per_share_raw
    UUID currency_id FK
    TIMESTAMP created_at
    TIMESTAMP updated_at
  }

  %% ==========================================
  %% CREDIT & LOANS
  %% ==========================================
  credit_accounts {
    UUID id PK
    UUID user_id FK
    UUID account_id FK "nullable"
    STRING type "mortgage/personal/paylater/credit_card"
    STRING provider_name
    BIGINT principal_amount_raw
    FLOAT interest_rate
    INT duration_months
    BIGINT credit_limit "nullable"
    BIGINT amount "nullable"
    BIGINT monthly_installment "nullable"
    DATE due_date "nullable"
    DATE start_date
    TEXT notes "nullable"
    TIMESTAMP created_at
    TIMESTAMP updated_at
  }
  credit_schedules {
    UUID id PK
    UUID credit_id FK
    DATE due_date
    BIGINT amount_due_raw
    BIGINT principal_portion_raw
    BIGINT interest_portion_raw
    BOOLEAN is_paid
    DATE paid_date "nullable"
    UUID transaction_id FK "nullable"
    TIMESTAMP created_at
    TIMESTAMP updated_at
  }

  %% ==========================================
  %% PLANNING
  %% ==========================================
  goals {
    UUID id PK
    UUID user_id FK
    BIGINT linked_account_id FK "nullable"
    STRING name
    STRING type "emergency/hajj/retirement/custom"
    BIGINT target_amount_raw
    BIGINT current_amount_raw
    UUID currency_id FK
    DATE deadline_date "nullable"
    TIMESTAMP created_at
    TIMESTAMP updated_at
  }
  insurance_policies {
    UUID id PK
    UUID user_id FK
    STRING policy_number
    STRING provider_name
    STRING type "life/health/vehicle/property"
    BIGINT premium_amount_raw
    UUID currency_id FK
    STRING premium_period "monthly/yearly"
    DATE expiry_date
    BIGINT coverage_amount_raw
    TIMESTAMP created_at
    TIMESTAMP updated_at
  }
  zakat_calculations {
    UUID id PK
    UUID user_id FK
    STRING zakat_type "mal/income/gold"
    BIGINT asset_value_raw
    BIGINT nisab_value_raw
    BIGINT zakat_due_raw
    UUID currency_id FK
    DATE calculation_date
    BOOLEAN is_paid
    UUID transaction_id FK "nullable"
    TIMESTAMP created_at
    TIMESTAMP updated_at
  }

  %% ==========================================
  %% GAMIFICATION
  %% ==========================================
  gamification_profiles {
    UUID id PK
    UUID user_id FK
    BIGINT xp
    BIGINT coins
    BIGINT gemfin
    INT level
    STRING level_name
    TIMESTAMP last_active_date
    TIMESTAMP created_at
    TIMESTAMP updated_at
  }
  streaks {
    UUID id PK
    UUID user_id FK
    STRING type "login/transaction/budget/investment/saving"
    INT current_count
    INT longest_count
    TIMESTAMP last_triggered_at
    BOOLEAN shield_active
    INT shield_count
    TIMESTAMP created_at
    TIMESTAMP updated_at
  }
  quests {
    UUID id PK
    STRING title
    STRING type "daily/weekly"
    STRING action_type
    INT target_count
    BIGINT xp_reward
    BIGINT coin_reward
    TIMESTAMP created_at
    TIMESTAMP updated_at
  }
  user_quests {
    UUID id PK
    UUID user_id FK
    UUID quest_id FK
    INT progress_count
    BOOLEAN is_completed
    TIMESTAMP completed_at "nullable"
    DATE period_date
    TIMESTAMP created_at
    TIMESTAMP updated_at
  }
  badges {
    UUID id PK
    STRING name
    STRING description
    STRING icon_url
    STRING trigger_type
    INT trigger_value
    STRING rarity "common/rare/epic/legendary"
    TIMESTAMP created_at
    TIMESTAMP updated_at
  }
  user_badges {
    UUID id PK
    UUID user_id FK
    UUID badge_id FK
    TIMESTAMP earned_at
    TIMESTAMP created_at
    TIMESTAMP updated_at
  }
  challenges {
    UUID id PK
    STRING title
    STRING type "saving/spending/investment"
    BIGINT target_amount_raw "nullable"
    UUID currency_id FK "nullable"
    DATE start_date
    DATE end_date
    BIGINT xp_reward
    BIGINT coin_reward
    TIMESTAMP created_at
    TIMESTAMP updated_at
  }
  challenge_participants {
    UUID id PK
    UUID challenge_id FK
    UUID user_id FK
    BIGINT progress_amount_raw
    BOOLEAN is_winner
    TIMESTAMP joined_at
    TIMESTAMP created_at
    TIMESTAMP updated_at
  }
  referrals {
    UUID id PK
    BIGINT referrer_user_id FK
    BIGINT referred_user_id FK
    STRING referral_code
    BOOLEAN is_activated
    TIMESTAMP activated_at "nullable"
    BIGINT xp_reward_given
    BIGINT coin_reward_given
    TIMESTAMP created_at
    TIMESTAMP updated_at
  }
  reward_items {
    UUID id PK
    STRING name
    STRING type "cashback/voucher/frame/theme/shield/fee_waiver"
    BIGINT coin_price
    BIGINT gemfin_price "nullable"
    INT stock
    BOOLEAN is_active
    JSON metadata
    TIMESTAMP created_at
    TIMESTAMP updated_at
  }
  reward_redemptions {
    UUID id PK
    UUID user_id FK
    UUID reward_item_id FK
    BIGINT coins_spent
    STRING status "pending/completed/failed"
    TIMESTAMP redeemed_at
    TIMESTAMP created_at
    TIMESTAMP updated_at
  }
  leaderboard_snapshots {
    UUID id PK
    UUID user_id FK
    STRING period_type "weekly/monthly"
    DATE period_date
    STRING scope "friends/city/national"
    INT rank
    BIGINT total_xp
    INT streak_count
    TIMESTAMP created_at
  }
  weekly_recaps {
    UUID id PK
    UUID user_id FK
    DATE week_start_date
    BIGINT total_income_raw
    BIGINT total_expense_raw
    INT streak_count
    BIGINT xp_earned
    JSON badges_earned
    BOOLEAN is_sent
    TIMESTAMP sent_at "nullable"
    TIMESTAMP created_at
    TIMESTAMP updated_at
  }
  shareable_cards {
    UUID id PK
    UUID user_id FK
    STRING card_type "streak/wrapped/badge/goal/level_up/health_score"
    STRING image_url "nullable"
    JSON metadata
    BOOLEAN numbers_visible
    TIMESTAMP generated_at
    TIMESTAMP created_at
    TIMESTAMP updated_at
  }

  %% ==========================================
  %% ECOSYSTEM
  %% ==========================================
  vault_documents {
    UUID id PK
    UUID user_id FK
    STRING name
    STRING file_type "pdf/image/doc"
    STRING encrypted_url
    STRING doc_category "salary_slip/npwp/policy/certificate/other"
    TIMESTAMP created_at
    TIMESTAMP updated_at
  }
  news_preferences {
    UUID id PK
    UUID user_id FK
    JSON topics
    JSON asset_tickers
    TIMESTAMP created_at
    TIMESTAMP updated_at
  }
  learning_progress {
    UUID id PK
    UUID user_id FK
    STRING content_id
    STRING content_type "article/video/quiz/path"
    INT progress_pct
    BOOLEAN is_completed
    TIMESTAMP last_accessed_at
    TIMESTAMP created_at
    TIMESTAMP updated_at
  }

  %% ==========================================
  %% RELATIONS
  %% ==========================================
  users ||--|| user_settings : has
  users ||--o{ family_members : owns
  users ||--o{ accounts : owns
  users ||--o{ categories : owns
  users ||--o{ tags : owns
  users ||--o{ transactions : makes
  users ||--o{ budget_plans : plans
  users ||--o{ subscriptions : subscribes
  users ||--o{ split_bills : creates
  users ||--o{ reminders : has
  users ||--o{ automation_rules : configures
  users ||--o{ round_up_configs : configures
  users ||--o{ salary_split_configs : configures
  users ||--o{ document_extractions : owns
  users ||--o{ llm_providers : owns
  users ||--o{ portfolios : holds
  users ||--o{ watchlists : watches
  users ||--o{ credit_accounts : owes
  users ||--o{ goals : sets
  users ||--o{ insurance_policies : owns
  users ||--o{ zakat_calculations : calculates
  users ||--|| gamification_profiles : has
  users ||--o{ streaks : tracks
  users ||--o{ user_quests : completes
  users ||--o{ user_badges : earns
  users ||--o{ challenge_participants : joins
  users ||--o{ referrals : refers
  users ||--o{ reward_redemptions : redeems
  users ||--o{ leaderboard_snapshots : ranked
  users ||--o{ weekly_recaps : receives
  users ||--o{ shareable_cards : generates
  users ||--o{ vault_documents : stores
  users ||--|| news_preferences : has
  users ||--o{ learning_progress : tracks

  currencies ||--o{ accounts : used_in
  currencies ||--o{ transactions : used_in
  currencies ||--o{ portfolios : used_in
  currencies ||--o{ goals : used_in
  currencies ||--o{ credit_accounts : used_in

  accounts ||--o{ account_balances : snapshotted
  accounts ||--o{ transactions : source
  accounts ||--o{ credit_accounts : linked

  categories ||--o{ transactions : categorizes
  categories ||--o{ budget_item_categories : mapped

  statuses ||--o{ transactions : assigns
  recurring_types ||--o{ transactions : assigns
  tags ||--o{ transaction_tags : labels
  transactions ||--o{ transaction_tags : tagged_with
  transactions ||--o| document_extractions : sourced_from
  transactions ||--o| split_bills : originates

  budget_plans ||--o{ budget_items : contains
  budget_items ||--o{ budget_item_categories : categorized_by
  budget_items ||--o{ transactions : tracked_by

  assets ||--o{ portfolios : defines
  assets ||--o{ watchlists : tracked
  assets ||--o{ asset_price_history : has
  assets ||--o{ dividend_events : pays

  credit_accounts ||--o{ credit_schedules : scheduled
  credit_schedules ||--o| transactions : paid_via

  goals ||--o| round_up_configs : linked

  quests ||--o{ user_quests : assigned
  badges ||--o{ user_badges : awarded
  challenges ||--o{ challenge_participants : has
  reward_items ||--o{ reward_redemptions : redeemed
  zakat_calculations ||--o| transactions : paid_via
```