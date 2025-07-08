import { Component, effect, forwardRef, input, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { EventTermDTO } from '../../../rest/model/event-term-dto';
import { DestroyableComponent } from '../../base/destroyable.component';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { RemainCapacityTagComponent } from "../../components/tags/remain-capacity-tag/remain-capacity-tag.component";
import { MessageModule } from 'primeng/message';
import { EventTermCapacityStatus } from '../../types/enum/event-term-capacity-status';

@Component({
    selector: 'app-event-term-selector',
    imports: [
        DatePipe, CurrencyPipe,
        MessageModule,
        RemainCapacityTagComponent
    ],
    templateUrl: './event-term-selector.component.html',
    styles: ``,
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => EventTermSelectorComponent),
        multi: true
    }]
})
export class EventTermSelectorComponent extends DestroyableComponent implements ControlValueAccessor {

    protected EventTermCapacityStatus = EventTermCapacityStatus;

    public eventUUID = input<string>();

    public setDefault = input<boolean>(true);

    // shows a selector as an admin panel
    public showAdmin = input<boolean>(false);

    protected terms = signal<Array<EventTermDTO>>([]);
    protected selectedIndex = signal<number>(-1);
    protected disabled = signal<boolean>(false);

    private onChange: (value?: number) => void = () => { };
    private onTouched = () => { };

    constructor() {
        super();

        // load capacities for the Event when input gets set
        effect(() => {
            const eventUUID = this.eventUUID();
            if (!eventUUID) return;

            // TODO load terms with capacities
        });

        // setting the first option as default
        effect(() => {
            const terms = this.terms();

            if (!terms.length) return;

            if (terms.length === 1) {
                this.onTermClick(0);
                return;
            }

            if (!this.setDefault()) return;

            this.onTermClick(0);
        });

        // update parent
        effect(() => {
            const selectedIndex = this.selectedIndex();
            const terms = this.terms();
            const selectedTerm = terms[selectedIndex];

            if (!selectedTerm) return;

            this.selectedTermChanged(selectedTerm);
        });
    }

    // #ControlValueAccessor
    writeValue(obj: any): void {
        if (!obj) return;

        const foundIndex = this.terms().findIndex(t => t.id === obj);
        this.selectedIndex.set(foundIndex);
    }

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    setDisabledState?(isDisabled: boolean): void {
        this.disabled.set(isDisabled);
    }

    // /ControlValueAccessor

    protected onTermClick(index: number) {
        this.selectedIndex.set(index);
    }

    protected getCapacityStatus(term: EventTermDTO) {
        return EventTermCapacityStatus.FREE;
    }

    protected isFilled(status: EventTermCapacityStatus) {
        return status === EventTermCapacityStatus.FILLED;
    }

    protected showCapacityFullMessage(status: EventTermCapacityStatus) {
        return status === EventTermCapacityStatus.FILLED || status === EventTermCapacityStatus.LAST_ONE;
    }

    private selectedTermChanged(term: EventTermDTO) {
        this.onChange(term.id);
    }
}
