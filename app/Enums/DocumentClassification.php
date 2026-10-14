<?php

namespace App\Enums;

enum DocumentClassification: string
{
    case Biasa = 'biasa';
    case Terbatas = 'terbatas';
    case Rahasia = 'rahasia';

    public function label(): string
    {
        return match ($this) {
            self::Biasa => 'BIASA',
            self::Terbatas => 'TERBATAS',
            self::Rahasia => 'RAHASIA',
        };
    }

    public function color(): string
    {
        return match ($this) {
            self::Biasa => 'emerald',
            self::Terbatas => 'amber',
            self::Rahasia => 'red',
        };
    }
}
