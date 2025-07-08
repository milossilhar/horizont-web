/**
 * Represents the severity levels for an NgTag component.
 *
 * This type defines a set of possible string values to represent the visual severity or emphasis of a tag.
 * It includes options for different levels of importance, status, or categorization that can be applied to a tag.
 *
 * Possible values:
 * - `undefined`: No severity is applied.
 * - `'secondary'`: Represents a less prominent or secondary level of importance.
 * - `'success'`: Indicates a successful state or action.
 * - `'info'`: Represents informational content or status.
 * - `'warn'`: Indicates a warning state.
 * - `'danger'`: Represents a critical or error state.
 * - `'contrast'`: Used for high visual contrast or emphasis.
 */
export type NgTagSeverity = undefined | 'secondary' | 'success' | 'info' | 'warn' | 'danger' | 'contrast';

/**
 * Defines the possible severity levels for toast notifications in the NgToast system.
 * These severity levels are used to categorize and style messages displayed to the user.
 *
 * The supported severity levels are:
 * - `undefined`: Represents no specific severity.
 * - `'success'`: Indicates a successful operation or positive feedback.
 * - `'info'`: Represents informational messages intended to guide or notify the user.
 * - `'warn'`: Denotes a warning or cautionary message.
 * - `'error'`: Indicates an error or a critical issue.
 * - `'secondary'`: Represents a less prominent or alternative message style.
 * - `'contrast'`: Denotes a high-contrast message for emphasis or accessibility.
 */
export type NgToastSeverity = undefined | 'success' | 'info' | 'warn' | 'error' | 'secondary' | 'contrast';

/**
 * Represents the severity levels that can be applied to an NgButton component.
 *
 * This type defines various predefined severity levels to style buttons, allowing developers
 * to express different types of actions or statuses in the application.
 *
 * The available severity levels are:
 * - undefined: Represents the absence of a defined severity, providing a neutral or default button style.
 * - 'primary': Indicates a primary action.
 * - 'secondary': Used for less prominent or secondary actions.
 * - 'success': Represents a successful outcome, commonly associated with positive actions.
 * - 'info': Used to indicate informational messages or actions.
 * - 'warn': Represents a warning or non-critical alert.
 * - 'help': Suggests assistance or guidance.
 * - 'danger': Used for destructive actions or critical alerts.
 * - 'contrast': Provides a visually distinct style for emphasis.
 */
export type NgButtonSeverity = undefined | 'primary' | 'secondary' | 'success' | 'info' | 'warn' | 'help' | 'danger' | 'contrast';