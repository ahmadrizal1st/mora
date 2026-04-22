<?php

namespace App\Data;

use Spatie\LaravelData\Data;
use App\Models\Tag;

class TagData extends Data
{
    public function __construct(
        public ?int $id,
        public string $name,
        public string $color,
    ) {}

    public static function fromModel(Tag $tag): self
    {
        return new self(
            id: $tag->id,
            name: $tag->name,
            color: $tag->color,
        );
    }
}
