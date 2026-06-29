<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Storefront Routes
|--------------------------------------------------------------------------
|
| Design-only storefront pages. Each renders an Inertia page that currently
| uses client-side mock data shaped like the Auth Laravel Backend API.
| Controllers / API wiring can replace these later without touching the UI.
|
*/

Route::inertia('/', 'shop/Home')->name('home');

Route::inertia('products', 'shop/Products')->name('products.index');
Route::inertia('products/{product}', 'shop/ProductDetail')->name('products.show');

Route::inertia('cart', 'shop/Cart')->name('cart.index');
Route::inertia('wishlist', 'shop/Wishlist')->name('wishlist.index');
Route::inertia('checkout', 'shop/Checkout')->name('checkout');

Route::inertia('orders', 'shop/Orders')->name('orders.index');
Route::inertia('orders/{order}', 'shop/OrderDetail')->name('orders.show');
