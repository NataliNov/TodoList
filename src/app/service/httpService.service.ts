import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Item, ItemsData } from '../types/item-type';
import { typeItem } from '../constants/type-item';
import { Observable, Subject, switchMap, tap } from 'rxjs';

@Injectable()
export class HttpService {

    readDataSubject$ = new Subject<ItemsData>();

    private filter = '';

    constructor(private http: HttpClient) { }

    /**
     * Возвращает записи
     * @param {string[]} type признак вовзращения типа записей. При отсутствии выводит все записи 
     * @returns 
     */

    getAllItems$(type?: string): Observable<ItemsData> {
        let params = {};
        if (type) {
            this.filter = type;
        }
        params = new HttpParams().set('type', this.filter);
        return this.http.get<ItemsData>('http://localhost:4200/getAllItems', { params }).pipe(
            tap((items: ItemsData) => {
                this.readDataSubject$.next(items);
            })
        );
    }

    /**
     * Добавляет запись
     * @param {Item} item Добавляемая запись 
     * @returns 
     */
    addItem$(item: Item): Observable<ItemsData> {
        return this.http.post('http://localhost:4200/addItem', item).pipe(
            switchMap(() => this.getAllItems$())
        );
    }

    /**
     * Удаляет запись/ записи
     * Если не передан параметр - то удаляем все записи с флагом выполнен
     * @param {Item} item удаляемая запись 
     * @returns 
     */
    removeItem$(item?: Item): Observable<ItemsData> {
        let params;
        if (!item) {
            params = new HttpParams()
                .set('type', typeItem.completed)
        };

        return this.http.delete('http://localhost:4200/removeItem', (item ? { body: item } : { params })).pipe(
            switchMap(() => this.getAllItems$())
        );
    }

    /**
     * Обновляет запись
     * @param {Item} item обновляемая запись 
     * @returns 
     */
    updateItem$(item: Item): Observable<ItemsData> {
        return this.http.put('http://localhost:4200/updateItem', item).pipe(
            switchMap(() => this.getAllItems$())
        );
    }

    /**
     * Выделяет/снимает с выделения все записи
     * @param {boolean} isSelect признак снятия/ установки выделения всех записей 
     * @returns 
     */
    selectedAllItems$(isSelect: boolean): Observable<ItemsData> {
        const params = new HttpParams()
            .set('selectedAllItems', isSelect);
        return this.http.put('http://localhost:4200/selectItems', null, { params }).pipe(
            switchMap(() => this.getAllItems$())
        );
    }
}