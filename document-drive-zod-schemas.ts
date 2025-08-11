import { z } from "zod";

export const StringSchema = z.string();

export const IntSchema = z.number();

export const DecimalSchema = z.number();

export const FloatSchema = z.number();

export const BooleanSchema = z.boolean();

export const IDSchema = z.string();

export const DateTimeSchema = z.date();

export const JSONSchema = z.json();

export const UnknownSchema = z.unknown();

export const TransmitterTypeSchema = z.enum([
  "Internal",
  "SwitchboardPush",
  "PullResponder",
  "SecureConnect",
  "MatrixConnect",
  "RESTWebhook",
]);

export const TriggerTypeSchema = z.enum(["PullResponder"]);

export const NodeSchema = z.union([
  z.lazy(() => FolderNodeSchema),
  z.lazy(() => FileNodeSchema),
]);

export const TriggerDataSchema = z.union([
  z.lazy(() => PullResponderTriggerDataSchema),
]);

export const FolderNodeSchema = z.object({
  id: StringSchema,
  name: StringSchema,
  kind: StringSchema,
  parentFolder: StringSchema.optional(),
});

export const FileNodeSchema = z.object({
  id: StringSchema,
  name: StringSchema,
  kind: StringSchema,
  documentType: StringSchema,
  parentFolder: StringSchema.optional(),
});

export const DocumentDriveStateSchema = z.object({
  name: StringSchema,
  nodes: z.array(z.lazy(() => NodeSchema)),
  icon: StringSchema.optional(),
});

export const ListenerFilterSchema = z.object({
  documentType: z.array(StringSchema).optional(),
  documentId: z.array(IDSchema).optional(),
  scope: z.array(StringSchema).optional(),
  branch: z.array(StringSchema).optional(),
});

export const ListenerCallInfoSchema = z.object({
  transmitterType: TransmitterTypeSchema.optional(),
  name: StringSchema.optional(),
  data: StringSchema.optional(),
});

export const ListenerSchema = z.object({
  listenerId: IDSchema,
  label: StringSchema.optional(),
  block: BooleanSchema,
  system: BooleanSchema,
  filter: ListenerFilterSchema,
  callInfo: ListenerCallInfoSchema.optional(),
});

export const PullResponderTriggerDataSchema = z.object({
  listenerId: IDSchema,
  url: StringSchema,
  interval: StringSchema,
});

export const TriggerSchema = z.object({
  id: IDSchema,
  type: TriggerTypeSchema,
  data: z.lazy(() => TriggerDataSchema).optional(),
});

export const DocumentDriveLocalStateSchema = z.object({
  sharingType: StringSchema.optional(),
  availableOffline: BooleanSchema,
  listeners: z.array(ListenerSchema),
  triggers: z.array(TriggerSchema),
});

export const AddFileInputSchema = z.object({
  id: IDSchema,
  name: StringSchema,
  documentType: StringSchema,
  parentFolder: IDSchema.optional(),
});

export const AddFolderInputSchema = z.object({
  id: IDSchema,
  name: StringSchema,
  parentFolder: IDSchema.optional(),
});

export const DeleteNodeInputSchema = z.object({
  id: IDSchema,
});

export const UpdateFileInputSchema = z.object({
  id: IDSchema,
  parentFolder: IDSchema.optional(),
  name: StringSchema.optional(),
  documentType: StringSchema.optional(),
});

export const UpdateNodeInputSchema = z.object({
  id: IDSchema,
  parentFolder: IDSchema.optional(),
  name: StringSchema.optional(),
});

export const CopyNodeInputSchema = z.object({
  srcId: IDSchema,
  targetId: IDSchema,
  targetName: StringSchema.optional(),
  targetParentFolder: IDSchema.optional(),
});

export const MoveNodeInputSchema = z.object({
  srcFolder: IDSchema,
  targetParentFolder: IDSchema.optional(),
});

export const SetDriveNameInputSchema = z.object({
  name: StringSchema,
});

export const SetSharingTypeInputSchema = z.object({
  type: StringSchema,
});

export const SetDriveIconInputSchema = z.object({
  icon: StringSchema,
});

export const SetAvailableOfflineInputSchema = z.object({
  availableOffline: BooleanSchema,
});

export const AddListenerInputSchema = z.object({
  listener: ListenerSchema,
});

export const RemoveListenerInputSchema = z.object({
  listenerId: StringSchema,
});

export const AddTriggerInputSchema = z.object({
  trigger: TriggerSchema,
});

export const RemoveTriggerInputSchema = z.object({
  triggerId: StringSchema,
});
export type String = z.infer<typeof StringSchema>;
export type Int = z.infer<typeof IntSchema>;
export type Decimal = z.infer<typeof DecimalSchema>;
export type Float = z.infer<typeof FloatSchema>;
export type Boolean = z.infer<typeof BooleanSchema>;
export type ID = z.infer<typeof IDSchema>;
export type DateTime = z.infer<typeof DateTimeSchema>;
export type JSON = z.infer<typeof JSONSchema>;
export type Unknown = z.infer<typeof UnknownSchema>;
export type TransmitterType = z.infer<typeof TransmitterTypeSchema>;
export type TriggerType = z.infer<typeof TriggerTypeSchema>;
export type Node = z.infer<typeof NodeSchema>;
export type TriggerData = z.infer<typeof TriggerDataSchema>;
export type FolderNode = z.infer<typeof FolderNodeSchema>;
export type FileNode = z.infer<typeof FileNodeSchema>;
export type DocumentDriveState = z.infer<typeof DocumentDriveStateSchema>;
export type ListenerFilter = z.infer<typeof ListenerFilterSchema>;
export type ListenerCallInfo = z.infer<typeof ListenerCallInfoSchema>;
export type Listener = z.infer<typeof ListenerSchema>;
export type PullResponderTriggerData = z.infer<typeof PullResponderTriggerDataSchema>;
export type Trigger = z.infer<typeof TriggerSchema>;
export type DocumentDriveLocalState = z.infer<typeof DocumentDriveLocalStateSchema>;
export type AddFileInput = z.infer<typeof AddFileInputSchema>;
export type AddFolderInput = z.infer<typeof AddFolderInputSchema>;
export type DeleteNodeInput = z.infer<typeof DeleteNodeInputSchema>;
export type UpdateFileInput = z.infer<typeof UpdateFileInputSchema>;
export type UpdateNodeInput = z.infer<typeof UpdateNodeInputSchema>;
export type CopyNodeInput = z.infer<typeof CopyNodeInputSchema>;
export type MoveNodeInput = z.infer<typeof MoveNodeInputSchema>;
export type SetDriveNameInput = z.infer<typeof SetDriveNameInputSchema>;
export type SetSharingTypeInput = z.infer<typeof SetSharingTypeInputSchema>;
export type SetDriveIconInput = z.infer<typeof SetDriveIconInputSchema>;
export type SetAvailableOfflineInput = z.infer<typeof SetAvailableOfflineInputSchema>;
export type AddListenerInput = z.infer<typeof AddListenerInputSchema>;
export type RemoveListenerInput = z.infer<typeof RemoveListenerInputSchema>;
export type AddTriggerInput = z.infer<typeof AddTriggerInputSchema>;
export type RemoveTriggerInput = z.infer<typeof RemoveTriggerInputSchema>;

