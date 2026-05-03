<?php

namespace App\Data;

use Spatie\LaravelData\Data;
use App\Models\Account;

class AccountData extends Data
{
    public function __construct(
        public ?string $id,
        public string $name,
        public string $currency_id,
        public ?string $provider_id,
        public string $color,
        public string $account_type,
        public bool $is_archived = false,
        public ?float $balance = 0,
        public ?int $transactions_count = 0,
        public ?int $incoming_transfers_count = 0,
        public ?array $history = null,
        public ?ProviderData $provider = null,
    ) {}

    public static function fromModel(Account $account): self
    {
        return new self(
            id: $account->id,
            name: $account->name,
            currency_id: $account->currency_id,
            provider_id: $account->provider_id,
            color: $account->color ?? '',
            account_type: $account->account_type,
            is_archived: (bool) $account->is_archived,
            balance: (float) ($account->balance ?? 0),
            transactions_count: $account->transactions_count ?? 0,
            incoming_transfers_count: $account->incoming_transfers_count ?? 0,
            history: $account->history ?? null,
            provider: $account->provider ? ProviderData::from($account->provider) : null,
        );
    }
}
