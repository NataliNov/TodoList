import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Item } from "../types/item-type";

export function createForm(item?: Item): FormGroup {
    return item ? 
    new FormGroup({
        id: new FormControl(item?.id),
        name: new FormControl(item.name),
        checked: new FormControl(item?.checked),
    })
    : new FormGroup({
        name: new FormControl('', [Validators.required, Validators.minLength(2)])
    });
}