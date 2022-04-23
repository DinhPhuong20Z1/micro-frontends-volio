/* !!
 * File: utils.service.ts
 * File Created: Friday, 22nd April 2022 2:35:22 pm
 * Author: KimEricko™ (phamkim.pr@gmail.com)
 * -----
 * Last Modified: Friday, 22nd April 2022 2:35:22 pm
 * Modified By: KimEricko™ (phamkim.pr@gmail.com>)
 * -----
 * Copyright 2022 - 2022 Volio, Volio Vietnam
 */

import { Injectable } from '@angular/core';
import { UtilsFunc } from '../data/utils';
import * as moment from 'moment';
@Injectable()
export class UtilsService extends UtilsFunc {
    secondsToUTCString(seconds: number): string {
        const date = new Date(seconds * 1000);
        return date.toUTCString();
    }

    secondsToLocalString(seconds: number): string {
        if (seconds === 0) {
            return "+inf";
        }
        const date = new Date(seconds * 1000);
        return date.toLocaleString();
    }

}
