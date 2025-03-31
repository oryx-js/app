import 'reflect-metadata';
import dotenv from 'dotenv';
import '@core/system/scope';
import OryxBoot from '@core/boot';

/** packages initialize */
dotenv.config();

/** bootstrap */
OryxBoot.start();
