import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedUiService {

  private _currentPage = new BehaviorSubject<string>("0");
  constructor() { }

  get currentPage(){
    return this._currentPage.asObservable();    
  }

  setCurrentPage(page: string){
    return this._currentPage.next(page);
  }
}
