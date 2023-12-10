import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { Emoji } from '../../../models/emoji';
import { Constant, ConstantCategory, ConstantType } from '../../../models/constant';
import { FirestoreConstantsDataService } from '../../../services/firestore-data/firestore-constants-data.service';

@Component({
  selector: 'app-create-edit-constant',
  templateUrl: './create-edit-constant.component.html',
  styleUrls: ['./create-edit-constant.component.scss']
})
export class CreateEditConstantComponent implements OnInit {

  Emoji = Emoji;
  ConstantType = ConstantType;
  ConstantCategory = ConstantCategory;
  form: FormGroup;
  loading = false;

  @Input() constant: Constant;
  @Input() constantType: ConstantType;

  constructor(
    private fb: FormBuilder,
    private firestoreConstantDataService: FirestoreConstantsDataService,
    public activeModal: NgbActiveModal
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.form = this.fb.group({
      name: this.fb.control<string | undefined>(this.constant?.name, [Validators.required]),
      category: this.fb.control<ConstantCategory | undefined>(this.constant?.category, this.constantType === ConstantType.FOOD_TYPE ? [Validators.required] : []),
      type: this.fb.control<ConstantType>({ value: this.constant?.type || this.constantType, disabled: true }, [Validators.required])
    });
  }

  save(): void {
    this.loading = true;
    let saveCall: Observable<void>;
    if (this.form.valid) {

      const formData = this.form.getRawValue();

      if (!this.constant) {
        saveCall = this.firestoreConstantDataService.create(formData);
      } else {
        saveCall = this.firestoreConstantDataService.update(this.constant.id, formData);
      }

      saveCall.subscribe(() => {
        this.loading = false;
        this.activeModal.close();
      }, () => this.loading = false);
    } else {
      this.loading = false;
    }
  }

  isValidField(fieldName: string, validationType = 'required'): boolean {
    return (this.form.get(fieldName)?.touched) && this.form.get(fieldName)?.errors?.[validationType];
  }
}
