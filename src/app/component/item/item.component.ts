import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Item } from '../../types/item-type';

@Component({
    selector: 'app-todolist-item',
    templateUrl: './item.component.html',
    styleUrls: ['./item.component.less'],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class ItemComponent {
    @Input() item: FormGroup = new FormGroup({});

    @Output() onDelete = new EventEmitter<Item>();
    @Output() onChecked = new EventEmitter<Item>();
    @Output() onChanged = new EventEmitter<Item>();


    isShowInput = false;

    private savedValue = {};
    /**
     * Обрабатывает клик по флажку
     */
    checked(): void {
        this.onChecked.emit(this.item.getRawValue());
    }
    /**
     * Обрабатывает клик по кнопке удаления 
     */
    deleted(): void {
        this.onDelete.emit(this.item.getRawValue());
    }
    /**
     * Обрабатывает изменения записи
     */
    changed(): void {
        this.onChanged.emit(this.item.getRawValue());
    }
    /**
     * Обрабатывае двойной клик по полю имени
     */
    dblClicked(): void {
        this.savedValue = this.item.getRawValue();
        this.isShowInput = !this.isShowInput;
    }

    /**
     * Обрабатывает потерю фокуса
     */
    onBlur(): void {
        this.isShowInput = false;
    }
    /**
     * Обрабатывает нажатия клавиш
     * @param {KeyboardEvent} event событие нажатие клавиши 
     */
    onKeyDown(event: KeyboardEvent): void {
        if (event.code === 'Escape') {
            this.item.patchValue(this.savedValue);
            this.changed();
        }
    }
}

