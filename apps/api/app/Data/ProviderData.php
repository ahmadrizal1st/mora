<?php

namespace App\Data;

use App\Models\Provider;
use Spatie\LaravelData\Data;

class ProviderData extends Data
{
    public function __construct(
        public string $id,
        public string $name,
        public string $type,
        public ?string $logo_url,
        public ?string $color,
        public bool $is_global,
    ) {}

    public static function fromModel(Provider $provider): self
    {
        return new self(
            id: $provider->id,
            name: $provider->name,
            type: $provider->type,
            logo_url: $provider->logo_url,
            color: $provider->color,
            is_global: $provider->is_global,
        );
    }
}
