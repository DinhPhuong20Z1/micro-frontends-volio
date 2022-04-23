import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { delay, map } from 'rxjs/operators';

const TOTAL_PAGES = 7;

export class NewsPost {
  first_name: string;
  last_name: string;
  avatar: string;
}

@Injectable()
export class NewsService {

  constructor(private http: HttpClient) {}

  load(page: number, pageSize: number): Observable<NewsPost[]> {
    const startIndex = ((page - 1) % TOTAL_PAGES) * pageSize;

    return this.http
      .get<NewsPost[]>('https://reqres.in/api/users?page=2')
      .pipe(
        map((news: any) => news.data.splice(startIndex, pageSize)),
        delay(1500),
      );
  }
}
