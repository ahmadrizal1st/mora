<?php

namespace App\Data;

use Spatie\LaravelData\Data;
use App\Models\Goal;

class GoalData extends Data
{
    public function __construct(
        public ?string $id,
        public string $name,
        public ?string $type,
        public float $target_amount,
        public ?float $current_amount,
        public ?string $currency_id,
        public ?string $linked_account_id,
        public ?string $deadline_date,
        public ?float $monthly_deposit,
        public ?string $icon,
        public ?string $color,
        public ?string $image_url,
        public ?string $created_at,
        public ?string $updated_at,
        public ?CurrencyData $currency = null,
        public ?AccountData $linkedAccount = null,
    ) {}

    public static function fromModel(Goal $goal): self
    {
        return new self(
            id: $goal->id,
            name: $goal->name,
            type: $goal->type,
            target_amount: (float) $goal->target_amount,
            current_amount: $goal->current_amount ? (float) $goal->current_amount : null,
            currency_id: $goal->currency_id,
            linked_account_id: $goal->linked_account_id,
            deadline_date: $goal->deadline_date?->toDateString(),
            monthly_deposit: $goal->monthly_deposit ? (float) $goal->monthly_deposit : null,
            icon: $goal->icon,
            color: $goal->color,
            image_url: $goal->image_url,
            created_at: $goal->created_at?->toDateTimeString(),
            updated_at: $goal->updated_at?->toDateTimeString(),
            currency: $goal->currency ? CurrencyData::from($goal->currency) : null,
            linkedAccount: $goal->linkedAccount ? AccountData::from($goal->linkedAccount) : null,
        );
    }
}
