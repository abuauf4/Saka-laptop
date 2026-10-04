<?php

namespace Database\Seeders;

use App\Models\HomepageContent;
use App\Models\Permission;
use App\Models\Role;
use App\Models\Setting;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use RuntimeException;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $groups=['dashboard'=>['view'],'submissions'=>['view','create','update','delete'],'qc'=>['view','update'],'offers'=>['view','create','update'],'inventory'=>['view','create','update','delete'],'cashier'=>['view','create','update','delete'],'reports'=>['view'],'articles'=>['view','create','update','delete'],'homepage'=>['view','update'],'settings'=>['view','update'],'users'=>['view','create','update','delete'],'roles'=>['view','create','update','delete']];
        foreach($groups as $group=>$actions){foreach($actions as $action){Permission::query()->firstOrCreate(['key'=>"{$group}.{$action}"],['label'=>ucfirst($group).' '.ucfirst($action),'group_name'=>$group]);}}
        $superAdmin=Role::query()->firstOrCreate(['slug'=>'super_admin'],['name'=>'Super Admin','description'=>'Full access','is_system'=>true]);
        $superAdmin->permissions()->sync(Permission::query()->pluck('id'));
        foreach([['slug'=>'manager','name'=>'Manager'],['slug'=>'staff','name'=>'Staff'],['slug'=>'viewer','name'=>'Viewer']] as $roleData){Role::query()->firstOrCreate(['slug'=>$roleData['slug']],['name'=>$roleData['name'],'is_system'=>true]);}
        $email=env('ADMIN_EMAIL','admin@saka-laptop.id'); $password=env('ADMIN_PASSWORD');
        if(! $password) throw new RuntimeException('ADMIN_PASSWORD wajib diisi sebelum db:seed di production.');
        $user=User::query()->updateOrCreate(['email'=>strtolower($email)],['name'=>'Saka Admin','password'=>Hash::make($password),'status'=>'active']);
        $user->roles()->sync([$superAdmin->id]); Setting::singleton(); HomepageContent::singleton();
    }
}
