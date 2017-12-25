import { Injectable } from '@angular/core';
import { Http } from "@angular/http";

import { Observable } from "rxjs";
@Injectable()
export class HomeService {

constructor(private http:Http) { }

getUsers():Observable<any>{
    return this.http.get("")
}
}