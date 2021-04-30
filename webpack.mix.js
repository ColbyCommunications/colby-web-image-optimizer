let mix = require('laravel-mix');

mix.js('src/index.js', 'dist').react();
mix.sass('src/app.scss', 'dist');
