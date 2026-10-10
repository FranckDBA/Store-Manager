<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Redirect;
use PHPStan\PhpDoc\Tag\RequireExtendsTag;


#[Fillable(['sale_id', 'product_id','product_name','unit_price','quantity','subtotal'])]


class SaleItem extends Model
{
    protected $table = 'sale_items';
    public function sale(): BelongsTo
    {
        return $this->belongsTo(Sale::class);
    }
}
