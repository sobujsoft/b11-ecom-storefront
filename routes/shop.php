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

Route::inertia('payment/success', 'shop/PaymentResult')->name('payment.success');
Route::inertia('payment/failed', 'shop/PaymentResult')->name('payment.failed');
Route::inertia('payment/cancel', 'shop/PaymentResult')->name('payment.cancel');
Route::inertia('payment/result', 'shop/PaymentResult')->name('payment.result');

Route::inertia('orders', 'shop/Orders')->name('orders.index');
Route::inertia('orders/{order}', 'shop/OrderDetail')->name('orders.show');

Route::inertia('account/login', 'shop/Login')->name('shop.login');
Route::inertia('account/register', 'shop/Register')->name('shop.register');
