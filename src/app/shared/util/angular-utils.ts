import { AbstractControl, FormArray, FormControl, FormGroup } from '@angular/forms';

/**
 * Marks the given form control and all of its children as `dirty`.
 *
 * This function traverses through the form hierarchy. If the provided `form` is:
 * - An instance of `FormControl`, it marks the control as `dirty`.
 * - An instance of `FormArray`, it marks the array and all its child controls as `dirty`.
 * - An instance of `FormGroup`, it marks the group and all its child controls as `dirty`.
 *
 * @param {AbstractControl} form - The form-control to be marked as dirty. It can be an instance
 * of `FormControl`, `FormArray`, or `FormGroup`.
 */
export const markAllAsDirty = (form: AbstractControl) => {
    if (form instanceof FormControl) {
      form.markAsDirty();
      return;
    }

    if (form instanceof FormArray) {
      const formArray = form as FormArray;
      formArray.markAsDirty();
      formArray.controls.forEach(control => markAllAsDirty(control))
    }

    if (form instanceof FormGroup) {
      const formGroup = form as FormGroup;
      formGroup.markAsDirty();
      Object.keys(formGroup.controls).forEach(key => markAllAsDirty(formGroup.controls[key]));
    }
  }
