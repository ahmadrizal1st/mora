<?php

namespace App\Data;

use Spatie\LaravelData\Data;
use App\Models\Currency;

class CurrencyData extends Data
{
    public function __construct(
        public ?int $id,
        public string $code,
        public string $symbol,
        public string $name,
        public float $rate_to_idr,
        public bool $is_default,
        public bool $is_active,
    ) {}

    public static function fromModel(Currency $currency): self
    {
        return new self(
            id: $currency->id,
            code: $currency->code,
            symbol: $currency->symbol,
            name: $currency->name,
            rate_to_idr: (float) $currency->rate_to_idr,
            is_default: (bool) $currency->is_default,
            is_active: (bool) $currency->is_active,
        );
    }
}
