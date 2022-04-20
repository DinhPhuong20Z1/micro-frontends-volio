import { concat, Observable, of, zip, throwError } from 'rxjs';
import { delay, map, repeat, catchError } from 'rxjs/operators';


function rateLimit(limit: number, window: number) {
    return <T > (source: Observable<T> ) => {
        // Start with the first `limit` number of items already emittable
        const initialRelease = of({}).pipe(repeat(limit));

        // Release another item `windowMsec` miliseconds after one has been comsumed
        const delayedRelease = source.pipe(delay(window));

        const release = concat(initialRelease, delayedRelease);

        return zip(source, release).pipe(map(([a]) => a));
    };
}

export { rateLimit };
