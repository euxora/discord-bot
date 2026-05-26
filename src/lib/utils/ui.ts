// ─────────────────────────────────────────────────────────────────────────────
//  ui.ts — Caramel Design System — Components V2
//
//  All message responses must use the COMPONENTS_V2 flag.
//  Classic embeds (`embeds: [...]`) and raw `content` fields are NOT used.
//  Every user-facing message is built with these factory functions.
//
//  Default accent color: none (pass a hex number to Container to set one).
//
//  Discord limits to enforce:
//   - Max 40 components total per message (counting nested children)
//   - Max 4000 characters total across all Text components
//   - Max 5 buttons per Row
//   - Max 1 select per Row
//   - Max 10 items per MediaGallery
//   - Max 25 options per StringSelect
//   - Container children: Row | Text | Section | MediaGallery | Separator | File
//   - Section accessory: Button | LinkButton | Thumbnail (one, not both)
//
//  ❌ DO NOT:
//   - Use interaction.reply({ embeds: [...] }) — always Components V2
//   - Use interaction.reply({ content: '...' }) — wrap in Text() instead
//   - Place Text outside a Container at top level (breaks design system)
//   - Mix custom_id and url in the same button
//   - Put more than one select in a Row
//   - Use Row with TextInput inside modals (deprecated — use Label)
//
//  See bottom of file for full usage example.
// ─────────────────────────────────────────────────────────────────────────────

import { MessageFlags } from 'discord-api-types/v10';

/** Required flag for every Components V2 reply. */
export const COMPONENTS_V2_FLAGS = MessageFlags.IsComponentsV2;

// ─────────────────────────────────────────────
//  SHARED TYPES
// ─────────────────────────────────────────────

export interface PartialEmoji {
    name?: string;
    id?: string;
    animated?: boolean;
}

export interface MediaItem {
    url: string;
    description?: string;
    spoiler?: boolean;
}

export interface SelectOption {
    label: string;
    value: string;
    description?: string;
    emoji?: PartialEmoji;
    default?: boolean;
}

export interface ChoiceOption {
    value: string;
    label: string;
    description?: string;
    default?: boolean;
}

export type DefaultUser = { id: string; type: 'user' };
export type DefaultRole = { id: string; type: 'role' };
export type DefaultMentionable = DefaultUser | DefaultRole;
export type DefaultChannel = { id: string; type: 'channel' };

export type ButtonStyle = 1 | 2 | 3 | 4 | 5 | 6;
export type TextInputStyle = 1 | 2;
export type SeparatorSpacing = 1 | 2;

// ─────────────────────────────────────────────
//  COMPONENT RETURN TYPES
// ─────────────────────────────────────────────

export interface ContainerNode {
    type: 17;
    accent_color?: number;
    spoiler: boolean;
    components: ContainerChild[];
}

export interface SectionNode {
    type: 9;
    components: TextNode[];
    accessory?: SectionAccessory;
}

export interface RowNode {
    type: 1;
    components: RowChild[];
}

export interface SeparatorNode {
    type: 14;
    spacing: SeparatorSpacing;
    divider: boolean;
}

export interface TextNode {
    type: 10;
    content: string;
}

export interface ThumbnailNode {
    type: 11;
    media: { url: string };
    description?: string;
    spoiler: boolean;
}

export interface MediaGalleryNode {
    type: 12;
    items: Array<{ media: { url: string }; description?: string; spoiler?: boolean }>;
}

export interface FileNode {
    type: 13;
    file: { url: string };
    spoiler: boolean;
}

export interface ButtonNode {
    type: 2;
    custom_id: string;
    label: string;
    style: 1 | 2 | 3 | 4;
    emoji?: PartialEmoji;
    disabled: boolean;
}

export interface PremiumButtonNode {
    type: 2;
    style: 6;
    sku_id: string;
    disabled: boolean;
}

export interface LinkButtonNode {
    type: 2;
    style: 5;
    url: string;
    label: string;
    emoji?: PartialEmoji;
    disabled: boolean;
}

export interface StringSelectNode {
    type: 3;
    custom_id: string;
    options: SelectOption[];
    placeholder?: string;
    min_values?: number;
    max_values?: number;
    disabled: boolean;
}

export interface UserSelectNode {
    type: 5;
    custom_id: string;
    placeholder?: string;
    min_values?: number;
    max_values?: number;
    default_values?: DefaultUser[];
    disabled: boolean;
}

export interface RoleSelectNode {
    type: 6;
    custom_id: string;
    placeholder?: string;
    min_values?: number;
    max_values?: number;
    default_values?: DefaultRole[];
    disabled: boolean;
}

export interface MentionableSelectNode {
    type: 7;
    custom_id: string;
    placeholder?: string;
    min_values?: number;
    max_values?: number;
    default_values?: DefaultMentionable[];
    disabled: boolean;
}

export interface ChannelSelectNode {
    type: 8;
    custom_id: string;
    placeholder?: string;
    channel_types?: number[];
    min_values?: number;
    max_values?: number;
    default_values?: DefaultChannel[];
    disabled: boolean;
}

// Modal-only nodes
export interface LabelNode {
    type: 18;
    label: string;
    description?: string;
    component: ModalChild;
}

export interface TextInputNode {
    type: 4;
    custom_id: string;
    style: TextInputStyle;
    min_length?: number;
    max_length?: number;
    required?: boolean;
    value?: string;
    placeholder?: string;
}

export interface StringSelectModalNode {
    type: 3;
    custom_id: string;
    options: SelectOption[];
    placeholder?: string;
    min_values?: number;
    max_values?: number;
    required: boolean;
}

export interface UserSelectModalNode {
    type: 5;
    custom_id: string;
    placeholder?: string;
    max_values?: number;
    required: boolean;
}

export interface RoleSelectModalNode {
    type: 6;
    custom_id: string;
    placeholder?: string;
    max_values?: number;
    required: boolean;
}

export interface MentionableSelectModalNode {
    type: 7;
    custom_id: string;
    placeholder?: string;
    required: boolean;
}

export interface ChannelSelectModalNode {
    type: 8;
    custom_id: string;
    placeholder?: string;
    channel_types?: number[];
    required: boolean;
}

export interface FileUploadNode {
    type: 19;
    custom_id: string;
    min_values: number;
    max_values: number;
    required: boolean;
}

export interface RadioGroupNode {
    type: 21;
    custom_id: string;
    options: ChoiceOption[];
    required: boolean;
}

export interface CheckboxGroupNode {
    type: 22;
    custom_id: string;
    options: ChoiceOption[];
    min_values?: number;
    max_values?: number;
    required: boolean;
}

export interface CheckboxNode {
    type: 23;
    custom_id: string;
    default: boolean;
}

// ─────────────────────────────────────────────
//  DISCRIMINATED UNIONS
// ─────────────────────────────────────────────

/** Any button variant valid in a Row or Section accessory. */
export type AnyButton = ButtonNode | LinkButtonNode | PremiumButtonNode;

/** Any select menu variant valid in a Row (message context). */
export type AnySelect =
    | StringSelectNode
    | UserSelectNode
    | RoleSelectNode
    | MentionableSelectNode
    | ChannelSelectNode;

/** Children allowed inside a Row in message context. */
export type RowChild = AnyButton | AnySelect;

/** Accessory types allowed in a Section. */
export type SectionAccessory = AnyButton | ThumbnailNode;

/** Children allowed inside a Container. */
export type ContainerChild =
    | RowNode
    | TextNode
    | SectionNode
    | MediaGalleryNode
    | SeparatorNode
    | FileNode;

/** Top-level component for a message body. Prefer Container as the root. */
export type TopLevelComponent = ContainerNode | ContainerChild;

/** Children allowed inside a Label in modal context. */
export type ModalChild =
    | TextInputNode
    | StringSelectModalNode
    | UserSelectModalNode
    | RoleSelectModalNode
    | MentionableSelectModalNode
    | ChannelSelectModalNode
    | FileUploadNode
    | RadioGroupNode
    | CheckboxGroupNode
    | CheckboxNode;

/** Top-level component for a modal body. */
export type ModalComponent = LabelNode | TextNode;

// ─────────────────────────────────────────────
//  LAYOUT COMPONENTS (Message only)
// ─────────────────────────────────────────────

/**
 * type 17 — Visually groups a set of components with an optional accent color bar.
 * Top-level component. Can contain: Row, Text, Section, MediaGallery, Separator, File.
 */
export const Container = (
    components: ContainerChild[],
    accentColor: number | null = null,
    spoiler = false,
): ContainerNode => ({
    type: 17,
    ...(accentColor !== null && { accent_color: accentColor }),
    spoiler,
    components,
});

/**
 * type 9 — Associates text content with an accessory component (Button or Thumbnail).
 * Top-level component. Child components: Text only.
 */
export const Section = (
    components: TextNode[],
    accessory?: SectionAccessory,
): SectionNode => ({
    type: 9,
    components,
    ...(accessory !== undefined && { accessory }),
});

/**
 * type 1 — Row of interactive components.
 * Can contain: up to 5 Buttons, OR a single Select (String/User/Role/Mentionable/Channel).
 * NOTE: Row with TextInputs inside modals is deprecated — use Label instead.
 */
export const Row = (components: RowChild[]): RowNode => ({
    type: 1,
    components,
});

/**
 * type 14 — Adds vertical padding and optional visual divider between components.
 * spacing: 1 = small, 2 = large.
 */
export const Separator = (
    spacing: SeparatorSpacing = 1,
    divider = true,
): SeparatorNode => ({
    type: 14,
    spacing,
    divider,
});

// ─────────────────────────────────────────────
//  CONTENT COMPONENTS (Message only)
// ─────────────────────────────────────────────

/**
 * type 10 — Markdown text. Supports mentions, emoji, links, spoilers.
 * Available in both messages and modals (bare, not inside Row).
 * Falls back to zero-width space to avoid Discord rendering empty content errors.
 */
export const Text = (content: string): TextNode => ({
    type: 10,
    content: content.length > 0 ? content : '​',
});

/**
 * type 11 — Small image, used as a Section accessory.
 * Only valid inside Section's `accessory` field.
 * Supports: images, GIF, WEBP. No video.
 */
export const Thumbnail = (
    url: string,
    description?: string,
    spoiler = false,
): ThumbnailNode => ({
    type: 11,
    media: { url },
    ...(description !== undefined && { description }),
    spoiler,
});

/**
 * type 12 — Displays 1–10 media items in a gallery layout.
 */
export const MediaGallery = (items: MediaItem[]): MediaGalleryNode => ({
    type: 12,
    items: items.map(({ url, description, spoiler }) => ({
        media: { url },
        ...(description !== undefined && { description }),
        ...(spoiler !== undefined && { spoiler }),
    })),
});

/**
 * type 13 — Displays an uploaded file attachment.
 * `fileUrl` must use the `attachment://<filename>` syntax.
 */
export const File = (fileUrl: string, spoiler = false): FileNode => ({
    type: 13,
    file: { url: fileUrl },
    spoiler,
});

// ─────────────────────────────────────────────
//  INTERACTIVE COMPONENTS — MESSAGE
// ─────────────────────────────────────────────

/**
 * type 2 — Clickable button. Must be inside Row or Section accessory.
 * Styles: 1=Primary, 2=Secondary, 3=Success, 4=Danger.
 * For style 5 (Link) use `LinkButton`, for style 6 (Premium) use `PremiumButton`.
 */
export const Button = (
    custom_id: string,
    label: string,
    style: 1 | 2 | 3 | 4,
    emoji?: PartialEmoji,
    disabled = false,
): ButtonNode => ({
    type: 2,
    custom_id,
    label,
    style,
    ...(emoji !== undefined && { emoji }),
    disabled,
});

/**
 * type 2, style 5 — Link button variant. Uses `url` instead of `custom_id`.
 * Does NOT send an interaction when clicked.
 */
export const LinkButton = (
    url: string,
    label: string,
    emoji?: PartialEmoji,
    disabled = false,
): LinkButtonNode => ({
    type: 2,
    style: 5,
    url,
    label,
    ...(emoji !== undefined && { emoji }),
    disabled,
});

/**
 * type 2, style 6 — Premium button variant. Linked to a SKU.
 * No label or custom_id; Discord renders SKU info.
 */
export const PremiumButton = (
    sku_id: string,
    disabled = false,
): PremiumButtonNode => ({
    type: 2,
    style: 6,
    sku_id,
    disabled,
});

export interface StringSelectOptions {
    placeholder?: string;
    minValues?: number;
    maxValues?: number;
    disabled?: boolean;
}

/**
 * type 3 — Select menu with predefined text options. Must be inside Row.
 */
export const StringSelect = (
    custom_id: string,
    options: SelectOption[],
    config: StringSelectOptions = {},
): StringSelectNode => ({
    type: 3,
    custom_id,
    options,
    ...(config.placeholder !== undefined && { placeholder: config.placeholder }),
    ...(config.minValues !== undefined && { min_values: config.minValues }),
    ...(config.maxValues !== undefined && { max_values: config.maxValues }),
    disabled: config.disabled ?? false,
});

export interface UserSelectOptions {
    placeholder?: string;
    minValues?: number;
    maxValues?: number;
    defaultValues?: DefaultUser[];
    disabled?: boolean;
}

/**
 * type 5 — Select menu auto-populated with server users. Must be inside Row.
 */
export const UserSelect = (
    custom_id: string,
    config: UserSelectOptions = {},
): UserSelectNode => ({
    type: 5,
    custom_id,
    ...(config.placeholder !== undefined && { placeholder: config.placeholder }),
    ...(config.minValues !== undefined && { min_values: config.minValues }),
    ...(config.maxValues !== undefined && { max_values: config.maxValues }),
    ...(config.defaultValues !== undefined && { default_values: config.defaultValues }),
    disabled: config.disabled ?? false,
});

export interface RoleSelectOptions {
    placeholder?: string;
    minValues?: number;
    maxValues?: number;
    defaultValues?: DefaultRole[];
    disabled?: boolean;
}

/**
 * type 6 — Select menu auto-populated with server roles. Must be inside Row.
 */
export const RoleSelect = (
    custom_id: string,
    config: RoleSelectOptions = {},
): RoleSelectNode => ({
    type: 6,
    custom_id,
    ...(config.placeholder !== undefined && { placeholder: config.placeholder }),
    ...(config.minValues !== undefined && { min_values: config.minValues }),
    ...(config.maxValues !== undefined && { max_values: config.maxValues }),
    ...(config.defaultValues !== undefined && { default_values: config.defaultValues }),
    disabled: config.disabled ?? false,
});

export interface MentionableSelectOptions {
    placeholder?: string;
    minValues?: number;
    maxValues?: number;
    defaultValues?: DefaultMentionable[];
    disabled?: boolean;
}

/**
 * type 7 — Select menu for users AND roles combined. Must be inside Row.
 */
export const MentionableSelect = (
    custom_id: string,
    config: MentionableSelectOptions = {},
): MentionableSelectNode => ({
    type: 7,
    custom_id,
    ...(config.placeholder !== undefined && { placeholder: config.placeholder }),
    ...(config.minValues !== undefined && { min_values: config.minValues }),
    ...(config.maxValues !== undefined && { max_values: config.maxValues }),
    ...(config.defaultValues !== undefined && { default_values: config.defaultValues }),
    disabled: config.disabled ?? false,
});

export interface ChannelSelectOptions {
    placeholder?: string;
    channelTypes?: number[];
    minValues?: number;
    maxValues?: number;
    defaultValues?: DefaultChannel[];
    disabled?: boolean;
}

/**
 * type 8 — Select menu auto-populated with server channels. Must be inside Row.
 * `channelTypes`: filter by Discord channel type numbers (e.g. [0] = text, [2] = voice).
 */
export const ChannelSelect = (
    custom_id: string,
    config: ChannelSelectOptions = {},
): ChannelSelectNode => ({
    type: 8,
    custom_id,
    ...(config.placeholder !== undefined && { placeholder: config.placeholder }),
    ...(config.channelTypes !== undefined && { channel_types: config.channelTypes }),
    ...(config.minValues !== undefined && { min_values: config.minValues }),
    ...(config.maxValues !== undefined && { max_values: config.maxValues }),
    ...(config.defaultValues !== undefined && { default_values: config.defaultValues }),
    disabled: config.disabled ?? false,
});

// ─────────────────────────────────────────────
//  MODAL-EXCLUSIVE COMPONENTS
//  All interactive components must be wrapped in Label (type 18).
//  Row with Text Inputs inside modals is deprecated.
// ─────────────────────────────────────────────

/**
 * type 18 — Wraps a modal component with a label and optional description.
 * Required wrapper for all interactive components inside modals.
 */
export const Label = (
    label: string,
    component: ModalChild,
    description?: string,
): LabelNode => ({
    type: 18,
    label,
    ...(description !== undefined && { description }),
    component,
});

export interface TextInputOptions {
    minLength?: number;
    maxLength?: number;
    required?: boolean;
    value?: string;
    placeholder?: string;
}

/**
 * type 4 — Free-form text input. Must be inside Label in modals.
 * style: 1 = single-line (Short), 2 = multi-line (Paragraph).
 */
export const TextInput = (
    custom_id: string,
    style: TextInputStyle,
    options: TextInputOptions = {},
): TextInputNode => ({
    type: 4,
    custom_id,
    style,
    ...(options.minLength !== undefined && { min_length: options.minLength }),
    ...(options.maxLength !== undefined && { max_length: options.maxLength }),
    ...(options.required !== undefined && { required: options.required }),
    ...(options.value !== undefined && { value: options.value }),
    ...(options.placeholder !== undefined && { placeholder: options.placeholder }),
});

export interface StringSelectModalOptions {
    placeholder?: string;
    minValues?: number;
    maxValues?: number;
    required?: boolean;
}

/**
 * type 3 — String select inside a modal. Must be inside Label.
 */
export const StringSelectModal = (
    custom_id: string,
    options: SelectOption[],
    config: StringSelectModalOptions = {},
): StringSelectModalNode => ({
    type: 3,
    custom_id,
    options,
    ...(config.placeholder !== undefined && { placeholder: config.placeholder }),
    ...(config.minValues !== undefined && { min_values: config.minValues }),
    ...(config.maxValues !== undefined && { max_values: config.maxValues }),
    required: config.required ?? true,
});

export interface UserSelectModalOptions {
    placeholder?: string;
    maxValues?: number;
    required?: boolean;
}

/**
 * type 5 — User select inside a modal. Must be inside Label.
 */
export const UserSelectModal = (
    custom_id: string,
    config: UserSelectModalOptions = {},
): UserSelectModalNode => ({
    type: 5,
    custom_id,
    ...(config.placeholder !== undefined && { placeholder: config.placeholder }),
    ...(config.maxValues !== undefined && { max_values: config.maxValues }),
    required: config.required ?? true,
});

export interface RoleSelectModalOptions {
    placeholder?: string;
    maxValues?: number;
    required?: boolean;
}

/**
 * type 6 — Role select inside a modal. Must be inside Label.
 */
export const RoleSelectModal = (
    custom_id: string,
    config: RoleSelectModalOptions = {},
): RoleSelectModalNode => ({
    type: 6,
    custom_id,
    ...(config.placeholder !== undefined && { placeholder: config.placeholder }),
    ...(config.maxValues !== undefined && { max_values: config.maxValues }),
    required: config.required ?? true,
});

export interface MentionableSelectModalOptions {
    placeholder?: string;
    required?: boolean;
}

/**
 * type 7 — Mentionable select inside a modal. Must be inside Label.
 */
export const MentionableSelectModal = (
    custom_id: string,
    config: MentionableSelectModalOptions = {},
): MentionableSelectModalNode => ({
    type: 7,
    custom_id,
    ...(config.placeholder !== undefined && { placeholder: config.placeholder }),
    required: config.required ?? true,
});

export interface ChannelSelectModalOptions {
    placeholder?: string;
    channelTypes?: number[];
    required?: boolean;
}

/**
 * type 8 — Channel select inside a modal. Must be inside Label.
 */
export const ChannelSelectModal = (
    custom_id: string,
    config: ChannelSelectModalOptions = {},
): ChannelSelectModalNode => ({
    type: 8,
    custom_id,
    ...(config.placeholder !== undefined && { placeholder: config.placeholder }),
    ...(config.channelTypes !== undefined && { channel_types: config.channelTypes }),
    required: config.required ?? true,
});

/**
 * type 19 — File upload input. Must be inside Label in modals.
 */
export const FileUpload = (
    custom_id: string,
    minValues = 1,
    maxValues = 1,
    required = true,
): FileUploadNode => ({
    type: 19,
    custom_id,
    min_values: minValues,
    max_values: maxValues,
    required,
});

/**
 * type 21 — Single-choice radio group. Must be inside Label in modals.
 * Min 2, max 10 options.
 */
export const RadioGroup = (
    custom_id: string,
    options: ChoiceOption[],
    required = true,
): RadioGroupNode => ({
    type: 21,
    custom_id,
    options,
    required,
});

export interface CheckboxGroupOptions {
    minValues?: number;
    maxValues?: number;
    required?: boolean;
}

/**
 * type 22 — Multi-choice checkbox group. Must be inside Label in modals.
 * Min 1, max 10 options.
 */
export const CheckboxGroup = (
    custom_id: string,
    options: ChoiceOption[],
    config: CheckboxGroupOptions = {},
): CheckboxGroupNode => ({
    type: 22,
    custom_id,
    options,
    ...(config.minValues !== undefined && { min_values: config.minValues }),
    ...(config.maxValues !== undefined && { max_values: config.maxValues }),
    required: config.required ?? true,
});

/**
 * type 23 — Single yes/no checkbox. Must be inside Label in modals.
 * Cannot be set as required directly — use CheckboxGroup with 1 option for that.
 */
export const Checkbox = (
    custom_id: string,
    defaultChecked = false,
): CheckboxNode => ({
    type: 23,
    custom_id,
    default: defaultChecked,
});

// ─────────────────────────────────────────────────────────────────────────────
//  USAGE EXAMPLE — Standard message structure
// ─────────────────────────────────────────────────────────────────────────────
//
//  import { COMPONENTS_V2_FLAGS, Container, Text, Section, Thumbnail,
//           Separator, Row, Button, LinkButton } from '#lib/ui';
//
//  await interaction.reply({
//    flags: COMPONENTS_V2_FLAGS,
//    components: [
//      Container([
//        Text('## Now Playing\nA short description here.'),
//        Separator(1, true),
//        Section(
//          [Text('**Track title**\nby Artist · 3:42')],
//          Thumbnail('https://i.scdn.co/image/...'),
//        ),
//        Row([
//          Button('music:pause',  'Pause',  2),
//          Button('music:skip',   'Skip',   1),
//          Button('music:stop',   'Stop',   4),
//          LinkButton('https://open.spotify.com/track/...', 'Open in Spotify'),
//        ]),
//      ]),
//    ],
//  });
//
//  USAGE EXAMPLE — Modal
//
//  import { Label, TextInput, RadioGroup } from '#lib/ui';
//
//  await interaction.showModal({
//    custom_id: 'feedback:submit',
//    title: 'Send feedback',
//    components: [
//      Label('Your name', TextInput('name', 1, { maxLength: 50, required: true })),
//      Label('Message',   TextInput('msg',  2, { maxLength: 1000, required: true })),
//      Label('Priority',  RadioGroup('priority', [
//        { value: 'low',  label: 'Low'  },
//        { value: 'med',  label: 'Medium', default: true },
//        { value: 'high', label: 'High' },
//      ])),
//    ],
//  });
// ─────────────────────────────────────────────────────────────────────────────
