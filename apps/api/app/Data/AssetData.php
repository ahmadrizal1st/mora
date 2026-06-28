<?php

namespace App\Data;

use Spatie\LaravelData\Data;
use App\Models\Asset;

class AssetData extends Data
{
    public function __construct(
        public ?string $id,
        public string $name,
        public ?string $category,
        public float $value,
        public ?string $purchase_date,
        public ?string $notes,
        public ?string $created_at,
        public ?string $updated_at,
    ) {}

    public static function fromModel(Asset $asset): self
    {
        return new self(
            id: $asset->id,
            name: $asset->name,
            category: $asset->category,
            value: (float) $asset->value,
            purchase_date: $asset->purchase_date?->toDateString(),
            notes: $asset->notes,
            created_at: $asset->created_at?->toDateTimeString(),
            updated_at: $asset->updated_at?->toDateTimeString(),
        );
    }
}
