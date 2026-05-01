<?php

namespace App\Data;

use Spatie\LaravelData\Data;
use App\Models\Currency;

class CurrencyData extends Data
{
    public function __construct(
        public ?string $id,
        public string $code,
        public string $symbol,
        public string $name,
    ) {}

    public static function fromModel(Currency $currency): self
    {
        return new self(
            id: $currency->id,
            code: $currency->code,
            symbol: $currency->symbol,
            name: $currency->name,
        );
    }
}
