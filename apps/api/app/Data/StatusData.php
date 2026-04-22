<?php

namespace App\Data;

use Spatie\LaravelData\Data;
use App\Models\Status;

class StatusData extends Data
{
    public function __construct(
        public ?int $id,
        public string $name,
        public string $color,
    ) {}

    public static function fromModel(Status $status): self
    {
        return new self(
            id: $status->id,
            name: $status->name,
            color: $status->color,
        );
    }
}
