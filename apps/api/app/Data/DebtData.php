<?php

namespace App\Data;

use Spatie\LaravelData\Data;
use App\Models\Debt;

class DebtData extends Data
{
    public function __construct(
        public ?string $id,
        public string $person_name,
        public string $type,
        public float $amount,
        public ?float $amount_paid,
        public ?string $status,
        public ?string $priority,
        public string $due_date,
        public ?string $description,
        public ?string $created_at,
        public ?string $updated_at,
    ) {}

    public static function fromModel(Debt $debt): self
    {
        return new self(
            id: $debt->id,
            person_name: $debt->person_name,
            type: $debt->type,
            amount: (float) $debt->amount,
            amount_paid: $debt->amount_paid ? (float) $debt->amount_paid : null,
            status: $debt->status,
            priority: $debt->priority,
            due_date: $debt->due_date->toDateString(),
            description: $debt->description,
            created_at: $debt->created_at?->toDateTimeString(),
            updated_at: $debt->updated_at?->toDateTimeString(),
        );
    }
}
