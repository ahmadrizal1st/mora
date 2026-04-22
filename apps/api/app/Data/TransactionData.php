<?php

namespace App\Data;

use Spatie\LaravelData\Data;
use App\Models\Transaction;
use Spatie\LaravelData\DataCollection;
use Spatie\LaravelData\Optional;

class TransactionData extends Data
{
    public function __construct(
        public ?int $id,
        public string $type,
        public float $amount_raw,
        public int $currency_id,
        public float $rate_snapshot,
        public float $amount_in_default,
        public int $account_id,
        public ?int $to_account_id,
        public ?int $category_id,
        public ?int $status_id,
        public ?int $recurring_type_id,
        public string $tx_date,
        public ?string $merchant,
        public ?string $notes,
        public ?array $dynamic_fields,
        
        // Relations
        public CurrencyData|Optional $currency,
        public AccountData|Optional $account,
        public AccountData|Optional $to_account,
        public CategoryData|Optional $category,
        
        /** @var DataCollection<TagData>|Optional */
        public DataCollection|Optional $tags,
    ) {}

    public static function fromModel(Transaction $transaction): self
    {
        return new self(
            id: $transaction->id,
            type: $transaction->type,
            amount_raw: (float) $transaction->amount_raw,
            currency_id: $transaction->currency_id,
            rate_snapshot: (float) $transaction->rate_snapshot,
            amount_in_default: (float) $transaction->amount_in_default,
            account_id: $transaction->account_id,
            to_account_id: $transaction->to_account_id,
            category_id: $transaction->category_id,
            status_id: $transaction->status_id,
            recurring_type_id: $transaction->recurring_type_id,
            tx_date: $transaction->tx_date instanceof \DateTimeInterface 
                ? $transaction->tx_date->format('Y-m-d') 
                : (string) $transaction->tx_date,
            merchant: $transaction->merchant,
            notes: $transaction->notes,
            dynamic_fields: $transaction->dynamic_fields,
            
            currency: $transaction->relationLoaded('currency') 
                ? CurrencyData::from($transaction->currency) 
                : Optional::create(),
            account: $transaction->relationLoaded('account') 
                ? AccountData::from($transaction->account) 
                : Optional::create(),
            to_account: $transaction->relationLoaded('to_account') && $transaction->to_account
                ? AccountData::from($transaction->to_account) 
                : Optional::create(),
            category: $transaction->relationLoaded('category') && $transaction->category
                ? CategoryData::from($transaction->category) 
                : Optional::create(),
            tags: $transaction->relationLoaded('tags')
                ? TagData::collect($transaction->tags, DataCollection::class)
                : Optional::create(),
        );
    }
}
