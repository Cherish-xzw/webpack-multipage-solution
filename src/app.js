import './polyfills';
import express from 'express';
import exphbs from 'express-handlebars';
import path from 'path';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';

import asset from './middlewares/asset_express';
import locals from './middlewares/locals';
import pages from './routes/pages';
import api from './routes/api';

const __PROD__ = process.env.NODE_ENV === 'production';

const app = express();

app.set('views', path.resolve(__dirname, './views'));
app.set('view engine', '.hbs');
app.engine(
  '.hbs',
  exphbs({
    layoutsDir: `${__dirname}/views/layouts`,
    defaultLayout: 'layout',
    extname: '.hbs',
  }),
);
app.use(
  express.static(path.join(__dirname, '../public'), {
    maxage: 1000 * 60 * 60 * 24 * 30, // a month
  }),
);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(
  asset({
    env: process.env.NODE_ENV,
    prepend: __PROD__ ? '' : 'http://localhost:8080',
    publicPath: '/assets/',
    manifestPath: path.join(__dirname, '../public/assets', 'manifest.json'),
  }),
);
app.use(locals());
app.use(pages());
app.use(api());

app.listen(4000, () => {
  console.log('express app started at http://localhost:4000');
});

export default app;