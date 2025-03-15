<?php

namespace App\Http\Controllers;

use App\Models\Tag;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TagController extends Controller
{
    public function index()
    {
        $tags = Tag::withCount('clients')->get();
        
        return Inertia::render('Tags/Index', [
            'tags' => $tags
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'color' => 'required|string|max:7',
        ]);

        Tag::create($validated);

        return redirect()->back()
            ->with('message', 'Тег успешно создан');
    }

    public function update(Request $request, Tag $tag)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'color' => 'required|string|max:7',
        ]);

        $tag->update($validated);

        return redirect()->back()
            ->with('message', 'Тег успешно обновлен');
    }

    public function destroy(Tag $tag)
    {
        $tag->delete();

        return redirect()->back()
            ->with('message', 'Тег успешно удален');
    }
}
