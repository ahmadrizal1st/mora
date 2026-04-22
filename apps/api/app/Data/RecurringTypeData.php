<?php

namespace App\Data;

use Spatie\LaravelData\Data;
use App\Models\RecurringType;

class RecurringTypeData extends Data
{
    public function __construct(
        public ?int $id,
        public string $name,
    ) {}

    public static function fromModel(RecurringType $recurringType): self
    {
        return new self(
            id: $recurringType->id,
            name: $recurringType->name,
        );
    }
}
