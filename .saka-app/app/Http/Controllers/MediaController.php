<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class MediaController extends Controller
{
    public function articleCover(string $filename): BinaryFileResponse
    {
        abort_unless(
            $filename === basename($filename)
            && preg_match('/^[A-Za-z0-9._-]+$/', $filename),
            404
        );

        $path = 'articles/'.$filename;
        abort_unless(Storage::disk('public')->exists($path), 404);

        return response()->file(
            Storage::disk('public')->path($path),
            [
                'Cache-Control' => 'public, max-age=31536000, immutable',
                'X-Content-Type-Options' => 'nosniff',
            ]
        );
    }
}
