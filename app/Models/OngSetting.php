<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OngSetting extends Model
{
    protected $fillable = [
        'ong_id', 'primary_color', 'hero_title', 
        'hero_subtitle', 'about_text', 
        'facebook_url', 'instagram_url'
    ];

    public function ong()
    {
        return $this->belongsTo(Ong::class);
    }
}