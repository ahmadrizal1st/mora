<?php

namespace App\Data;

use Spatie\LaravelData\Data;
use App\Models\Provider;

class ProviderData extends Data
{
    public function __construct(
        public ?string $id,
        public string $name,
        public string $type,
        public ?string $logo_url,
        public ?string $color,
        public bool $is_global,
        public ?string $user_id,
        public ?string $created_at,
        public ?string $updated_at,
    ) {}

    public static function fromModel(Provider $provider): self
    {
        return new self(
            id: $provider->id,
            name: $provider->name,
            type: $provider->type,
            logo_url: $provider->logo_url,
            color: $provider->color,
            is_global: (bool)$provider->is_global,
            user_id: $provider->user_id,
            created_at: $provider->created_at?->toDateTimeString(),
            updated_at: $provider->updated_at?->toDateTimeString(),
        );
    }
}
