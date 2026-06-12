<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OngSetting extends Model
{
   protected $fillable = [
        'ong_id', 'primary_color', 'secondary_color', 'hero_title', 
        'hero_subtitle', 'hero_image_url', 'about_text', 'mission_text',
        'facebook_url', 'instagram_url', 'pix_key', 'public_whatsapp', 'public_email', 'about_photo_1',
        'about_photo_2', 
        'manual_saved_count',
        'manual_volunteers_count', 'hero_image_url', 
        'hero_background_color',
    ];

    public function ong()
    {
        return $this->belongsTo(Ong::class);
    }
}