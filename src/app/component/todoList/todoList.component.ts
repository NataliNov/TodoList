import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subject, takeUntil, tap } from 'rxjs';
import { HttpService } from '../../service/httpService.service';
import { Item, ItemsData } from '../../types/item-type';
import { typeItem } from '../../constants/type-item';
import { createForm } from '../../binding/addForm'

@Component({
    selector: 'app-todolist',
    templateUrl: './todoList.component.html',
    styleUrls: ['./todoList.component.less'],
    providers: [HttpService],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class TodoListComponent implements OnInit, OnDestroy {
    items: FormGroup[] = [];
    isSelectAll = false;
    count = 0; // количество всех записей нужно для вывода кнопки Очистить завершенные
    countActive = 0; //количество активных
    addForm = createForm();
    activeFilter = ''; // признак активности кнопки фильтра. Три состояния - all, active и completed
    
    private destroy$: Subject<void> = new Subject();

    constructor(public httpService: HttpService) { }

    ngOnInit() {
        this.httpService.readDataSubject$.pipe(
            tap((items) => {
                this.readData(items);
            }),
            takeUntil(this.destroy$)
        ).subscribe()
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

    /**
     * Выводит записи 
     * @param {ItemsData} data записи 
     */
    private readData(data: ItemsData): void {
        const items: FormGroup[] = [];
        data.items.forEach((item) => {
            items.push(createForm(item));
        });
        this.items = items;
        this.countActive = data.countActive;
        this.count = data.count;
    }

    /**
     * Выделяет/снимает выделение со всех записей
     */
    selectAll(): void {
        this.httpService.selectedAllItems$(this.isSelectAll).subscribe();
    }

    /**
     * Добавляет запись
     */
    addItem(): void {
        if (this.addForm.valid) {
            this.httpService.addItem$({
                name: this.addForm.get("name")?.value,
                checked: false,
            })
                .subscribe();
            this.addForm.patchValue({ name: "" });
            this.isSelectAll = false;
        }
    }

    /**
     * Удаляет запись
     * @param {Item} item запись
     */
    removeItem(item: Item): void {
        this.httpService.removeItem$(item).subscribe();
    }

    /**
     * Меняет статус записи выполнена/активна 
     * @param {Item} item Обновляемая запись
     */
    changedChecked(item: Item): void {
        this.isSelectAll = false;
        this.setChangedItem(item);
    }

    /**
     * Обновляет запись
     * @param {Item} item Обновляемая запись
     */
    setChangedItem(item: Item): void {
        this.httpService.updateItem$(item).subscribe();
    }

    /**
     * Показывает все записи
     */
    showAll(): void {
        this.httpService.getAllItems$(typeItem.all).subscribe();
        this.activeFilter = '';
    }

    /**
     * Показать активные записи
     */
    showActive(): void {
        this.httpService.getAllItems$(typeItem.active).subscribe();
        this.activeFilter = typeItem.active;
    }

    /**
     * Показать завершенные записи
     */
    showCompleted(): void {
        this.httpService.getAllItems$(typeItem.completed).subscribe();
        this.activeFilter = typeItem.completed;
    }

    /**
     * Удаляет все завершенные записи
     */
    clearCompleted(): void {
        this.httpService.removeItem$().subscribe();
    }
}
