<?php

namespace App\Data;

use Spatie\LaravelData\Data;
use App\Models\Subscription;

class SubscriptionData extends Data
{
    public function __construct(
        public ?string $id,
        public string $name,
        public float $amount,
        public ?string $currency_id,
        public ?string $account_id,
        public string $next_billing_date,
        public ?bool $auto_renew,
        public ?string $billing_cycle,
        public ?string $status,
        public ?string $icon,
        public ?string $color,
        public ?string $created_at,
        public ?string $updated_at,
        public ?CurrencyData $currency = null,
        public ?AccountData $account = null,
    ) {}

    public static function fromModel(Subscription $subscription): self
    {
        return new self(
            id: $subscription->id,
            name: $subscription->name,
            amount: (float) $subscription->amount,
            currency_id: $subscription->currency_id,
            account_id: $subscription->account_id,
            next_billing_date: $subscription->next_billing_date->toDateString(),
            auto_renew: $subscription->auto_renew,
            billing_cycle: $subscription->billing_cycle,
            status: $subscription->status,
            icon: $subscription->icon,
            color: $subscription->color,
            created_at: $subscription->created_at?->toDateTimeString(),
            updated_at: $subscription->updated_at?->toDateTimeString(),
            currency: $subscription->currency ? CurrencyData::from($subscription->currency) : null,
            account: $subscription->account ? AccountData::from($subscription->account) : null,
        );
    }
}
