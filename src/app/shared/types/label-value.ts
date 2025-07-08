/**
 * A generic interface that represents a structure containing a value and its associated label.
 *
 * @template L The type of the label.
 * @template V The type of the value.
 */
export interface LabelValue<L, V> {
    label: L;
    value: V;
}
