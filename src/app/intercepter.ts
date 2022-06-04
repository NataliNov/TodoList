import {
    HttpEvent, HttpHandler, HttpInterceptor, HttpParams, HttpRequest, HttpResponse
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Item } from './types/item-type';
import { typeItem  } from './constants/type-item';

const GET_HTTP = 'GET';
const POST_HTTP = 'POST';
const PUT_HTTP = 'PUT';
const DELETE_HTTP = 'DELETE';

@Injectable()
export class BackendInterceptor implements HttpInterceptor {
    private items: Item[] = [];

    intercept(request: HttpRequest<Item>, next: HttpHandler): Observable<HttpEvent<Item[] | object>> {
        const item: Item = request.body as Item;
        if (!request.url.includes('error')) {
            switch (request.method) {
                case GET_HTTP:
                    return this.getAllItems(request.params.get('type'));
                case POST_HTTP:
                    return this.addItem(item);
                case PUT_HTTP:
                    return request.url.includes('selectItems') ? this.selectItems(request.params) : this.updateItem(item);
                case DELETE_HTTP:
                    return this.remove(item, request.params);
                default:
            }
        }
        return next.handle(request);
    }

    private getAllItems(filter: string | null): Observable<HttpEvent<Item[] | object>> {
        let items;
        switch (filter) {
            case typeItem.completed:
                items = this.getItems(false);
                return of(
                    new HttpResponse<Item[] | object>({
                        status: 200, body: {
                            items,
                            count: this.items.length,
                            countActive: this.items.length - items.length
                        }
                    }));
            case typeItem.active:
                items = this.getItems(true);
                return of(
                    new HttpResponse<Item[] | object>({
                        status: 200, body: {
                            items,
                            count: this.items.length,
                            countActive: items.length
                        }
                    }));
            default:
                return of(
                    new HttpResponse<Item[] | object>({
                        status: 200, body: {
                            items: this.items,
                            count: this.items.length,
                            countActive: this.getActiveCount()
                        }
                    }));
        }
    }

    private getItems(isActive: boolean):Item[] {
        return this.items
            .filter(item => isActive ? !item.checked : item.checked)
    }

    private getActiveCount(): number {
        return this.items
            .filter(item => !item.checked)
            .length;
    }

    private addItem(item: Item,): Observable<HttpEvent<Item>> {
        const maxId = this.items.length ? Math.max(...this.items.map(({ id }) => id || 0)) : 0;
        this.items.push({ ...item, id: maxId === 0 ? this.items.length : maxId + 1 });
        return of(
            new HttpResponse<Item>({ status: 200 })
        );
    }

    private updateItem(updateItem: Item): Observable<HttpEvent<Item>> {
        let index = this.items.findIndex((item) => { return (item.id) === updateItem.id });
        this.items[index] = updateItem;
        return of(
            new HttpResponse<Item>({ status: 200 })
        );
    }

    selectItems(params: HttpParams): Observable<HttpEvent<Item>> {
        const checked = params.get('selectedAllItems') === 'true';
        this.items.forEach(item => item.checked = checked);
        return of(
            new HttpResponse<Item>({ status: 200 })
        );
    }

    private removeItem(item: Item): void {
        let id = item.id;
        let index = this.items.findIndex((item) => { return (item.id) === id });
        this.items.splice(index, 1);
    }

    private remove(item: Item, params: HttpParams): Observable<HttpEvent<Item>> {
        if (params.get('type')) {
            this.items
                .filter(item => item.checked)
                .forEach(item => {
                    this.removeItem(item);
                })
        } else {
            this.removeItem(item);
        }
        return of(
            new HttpResponse<Item>({ status: 200 })
        );

    }
}
