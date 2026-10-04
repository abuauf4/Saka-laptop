<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable;
    protected $fillable = ['name', 'email', 'password', 'status'];
    protected $hidden = ['password', 'remember_token'];
    protected function casts(): array { return ['email_verified_at' => 'datetime', 'password' => 'hashed']; }
    public function roles(): BelongsToMany { return $this->belongsToMany(Role::class)->withTimestamps(); }
    public function canPermission(string $permission): bool
    {
        $this->loadMissing('roles.permissions');
        if ($this->roles->contains('slug', 'super_admin')) return true;
        return $this->roles->flatMap->permissions->contains('key', $permission);
    }
}
