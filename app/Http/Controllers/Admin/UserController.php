<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\View\View;

class UserController extends Controller
{
    public function index(): View
    {
        abort_unless(auth()->user()?->canPermission('users.view'), 403);
        return view('admin.users.index', ['users' => User::query()->with('roles')->latest()->paginate(20)]);
    }

    public function create(): View
    {
        abort_unless(auth()->user()?->canPermission('users.create'), 403);
        return view('admin.users.form', ['user' => new User(), 'roles' => Role::query()->orderBy('name')->get()]);
    }

    public function store(Request $request): RedirectResponse
    {
        abort_unless(auth()->user()?->canPermission('users.create'), 403);
        $data = $request->validate([
            'name' => ['required', 'string', 'max:120'],
            'email' => ['required', 'email', 'max:190', 'unique:users,email'],
            'password' => ['required', 'string', 'min:10'],
            'role_id' => ['required', 'exists:roles,id'],
            'status' => ['required', Rule::in(['active', 'inactive'])],
        ]);
        $user = User::query()->create([
            'name' => $data['name'], 'email' => strtolower($data['email']),
            'password' => Hash::make($data['password']), 'status' => $data['status'],
        ]);
        $user->roles()->sync([$data['role_id']]);
        return redirect()->route('admin.users.index')->with('status', 'User dibuat.');
    }

    public function edit(User $user): View
    {
        abort_unless(auth()->user()?->canPermission('users.update'), 403);
        return view('admin.users.form', ['user' => $user->load('roles'), 'roles' => Role::query()->orderBy('name')->get()]);
    }

    public function update(Request $request, User $user): RedirectResponse
    {
        abort_unless(auth()->user()?->canPermission('users.update'), 403);
        $data = $request->validate([
            'name' => ['required', 'string', 'max:120'],
            'email' => ['required', 'email', 'max:190', Rule::unique('users', 'email')->ignore($user->id)],
            'password' => ['nullable', 'string', 'min:10'],
            'role_id' => ['required', 'exists:roles,id'],
            'status' => ['required', Rule::in(['active', 'inactive'])],
        ]);
        $user->fill(['name' => $data['name'], 'email' => strtolower($data['email']), 'status' => $data['status']]);
        if (! empty($data['password'])) $user->password = Hash::make($data['password']);
        $user->save();
        $user->roles()->sync([$data['role_id']]);
        return back()->with('status', 'User diperbarui.');
    }

    public function destroy(User $user): RedirectResponse
    {
        abort_unless(auth()->user()?->canPermission('users.delete'), 403);
        abort_if(auth()->id() === $user->id, 422, 'Tidak bisa menghapus akun sendiri.');
        $user->delete();
        return redirect()->route('admin.users.index')->with('status', 'User dihapus.');
    }
}
