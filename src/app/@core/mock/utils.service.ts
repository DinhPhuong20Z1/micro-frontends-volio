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

    dataBytesToString(bytes: number): string {
        let idx: number = 0;
        let dataTransferConvert = bytes;
        let dataTransferUnit: string = "bytes";
        while (Math.abs(dataTransferConvert / 1024) > 1) {
            idx++;
            dataTransferConvert = Math.round(dataTransferConvert / 1024);
        }

        switch (idx) {
            case 0:
                dataTransferUnit = "Bytes";
                break;
            case 1:
                dataTransferUnit = "KB";
                break;
            case 2:
                dataTransferUnit = "MB";
                break;
            case 3:
                dataTransferUnit = "GB";
                break;
            case 4:
                dataTransferUnit = "TB";
                break;
            case 5:
                dataTransferUnit = "PB";
                break;
        }

        return dataTransferConvert + " " + dataTransferUnit;
    }
}
