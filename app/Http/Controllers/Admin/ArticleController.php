<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Article;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Illuminate\View\View;

class ArticleController extends Controller
{
    public function index(Request $request): View
    {
        $query = Article::query()->latest();

        if ($request->filled('q')) {
            $query->where('title', 'like', '%'.$request->string('q')->trim().'%');
        }

        if ($request->filled('status')) {
            $query->where('status', $request->string('status'));
        }

        return view('admin.articles.index', [
            'articles' => $query->paginate(20)->withQueryString(),
        ]);
    }

    public function create(): View
    {
        return view('admin.articles.form', ['article' => new Article()]);
    }

    public function store(Request $request): RedirectResponse
    {
        $article = Article::query()->create($this->validatedData($request));
        $this->storeCover($request, $article);

        return redirect()->route('admin.articles.edit', $article)
            ->with('status', 'Artikel dibuat.');
    }

    public function edit(Article $article): View
    {
        return view('admin.articles.form', compact('article'));
    }

    public function update(Request $request, Article $article): RedirectResponse
    {
        $article->update($this->validatedData($request, $article));
        $this->storeCover($request, $article);

        return back()->with('status', 'Artikel disimpan.');
    }

    public function destroy(Article $article): RedirectResponse
    {
        $this->deleteCover($article->cover_path);
        $article->delete();

        return redirect()->route('admin.articles.index')
            ->with('status', 'Artikel dihapus.');
    }

    private function validatedData(Request $request, ?Article $article = null): array
    {
        $data = $request->validate([
            'title' => ['required', 'string', 'max:190'],
            'slug' => ['nullable', 'string', 'max:190', Rule::unique('articles', 'slug')->ignore($article?->id)],
            'excerpt' => ['nullable', 'string', 'max:600'],
            'body' => ['required', 'string'],
            'status' => ['required', 'in:draft,published'],
            'meta_title' => ['nullable', 'string', 'max:190'],
            'meta_description' => ['nullable', 'string', 'max:320'],
            'cover' => ['nullable', 'image', 'max:3072'],
        ]);

        unset($data['cover']);

        $baseSlug = $data['slug'] ?: Str::slug($data['title']);
        $slug = $baseSlug;
        $suffix = 2;

        while (Article::query()
            ->where('slug', $slug)
            ->when($article, fn ($q) => $q->whereKeyNot($article->id))
            ->exists()) {
            $slug = $baseSlug.'-'.$suffix++;
        }

        $data['slug'] = $slug;
        $data['published_at'] = $data['status'] === 'published'
            ? ($article?->published_at ?? now())
            : null;

        return $data;
    }

    private function storeCover(Request $request, Article $article): void
    {
        if (! $request->hasFile('cover')) {
            return;
        }

        $this->deleteCover($article->cover_path);

        $file = $request->file('cover');
        $name = $article->slug.'-'.Str::random(8).'.'.$file->extension();

        Storage::disk('public')->putFileAs('articles', $file, $name);

        $article->update([
            'cover_path' => '/media/articles/'.$name,
        ]);
    }

    private function deleteCover(?string $coverPath): void
    {
        if (! $coverPath) {
            return;
        }

        if (str_starts_with($coverPath, '/media/articles/')) {
            Storage::disk('public')->delete('articles/'.basename($coverPath));
            return;
        }

        // Compatibility for covers uploaded before persistent runtime storage.
        if (str_starts_with($coverPath, '/uploads/articles/')) {
            File::delete(public_path(ltrim($coverPath, '/')));
        }
    }
}
