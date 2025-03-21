<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\DB;

class Client extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'email',
        'phone',
        'type',
        'status',
        'company_name',
        'inn',
        'kpp',
        'address',
        'description',
    ];

    protected $with = ['tags'];

    public function tasks()
    {
        return $this->hasMany(Task::class);
    }

    public function deals()
    {
        return $this->hasMany(Deal::class);
    }

    public function tags()
    {
        return $this->belongsToMany(Tag::class)
            ->withTimestamps();
    }

    public function scopeSearch($query, $search)
    {
        if ($search) {
            return $query->whereRaw("MATCH(name, email, phone, company_name) AGAINST(? IN BOOLEAN MODE)", [$search . '*']);
        }
        return $query;
    }

    public function scopeWithTag($query, $tagId)
    {
        if ($tagId) {
            return $query->whereHas('tags', function ($q) use ($tagId) {
                $q->where('tags.id', $tagId);
            });
        }
        return $query;
    }

    public function scopeFilterByType($query, $type)
    {
        if ($type) {
            return $query->where('type', $type);
        }
        return $query;
    }

    public function scopeFilterByStatus($query, $status)
    {
        if ($status) {
            return $query->where('status', $status);
        }
        return $query;
    }
}
