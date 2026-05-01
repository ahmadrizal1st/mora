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
        public string $color,
        public string $account_type,
        public ?float $balance_raw = 0,
        public ?int $transactions_count = 0,
        public ?int $incoming_transfers_count = 0,
        public ?array $history = null,
    ) {}

    public static function fromModel(Account $account): self
    {
        return new self(
            id: $account->id,
            name: $account->name,
            currency_id: $account->currency_id,
            color: $account->color,
            account_type: $account->account_type,
            balance_raw: (float) ($account->balance_raw ?? 0),
            transactions_count: $account->transactions_count ?? 0,
            incoming_transfers_count: $account->incoming_transfers_count ?? 0,
            history: $account->history ?? null,
        );
    }
}
