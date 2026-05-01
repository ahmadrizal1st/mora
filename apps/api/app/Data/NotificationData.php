<?php

namespace App\Data;

use Spatie\LaravelData\Data;
use Carbon\Carbon;

class NotificationData extends Data
{
    public function __construct(
        public string $id,
        public string $type,
        public array $data,
        public ?string $label,
        public bool $is_starred,
        public ?Carbon $read_at,
        public Carbon $created_at,
    ) {}

    public static function fromModel($notification): self
    {
        return new self(
            id: $notification->id,
            type: $notification->type,
            data: $notification->data,
            label: $notification->label,
            is_starred: (bool) $notification->is_starred,
            read_at: $notification->read_at,
            created_at: $notification->created_at,
        );
    }
}
