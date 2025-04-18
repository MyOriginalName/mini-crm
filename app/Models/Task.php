<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Traits\Loggable;

class Task extends Model
{
    use HasFactory, Loggable, SoftDeletes;

    protected $fillable = [
        'title',
        'description',
        'status',
        'priority',
        'due_date',
        'deadline',
        'user_id',
        'client_id',
        'deal_id',
    ];

    protected $casts = [
        'due_date' => 'date',
    ];

    // Accessor for deadline attribute to map to due_date
    public function getDeadlineAttribute()
    {
        return $this->due_date ? $this->due_date->format('Y-m-d') : null;
    }

    // Mutator for deadline attribute to set due_date
    public function setDeadlineAttribute($value)
    {
        $this->attributes['due_date'] = $value;
    }

    /**
     * Get the client that owns the task.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function client()
    {
        return $this->belongsTo(Client::class);
    }

    /**
     * Get the user that owns the task.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function deal()
    {
        return $this->belongsTo(Deal::class);
    }
}

