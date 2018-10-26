export type WidgetTemplateAction = (el: Element, gp: object) => void;
export type WidgetTemplateExec = (gp: object) => any;
export type WidgetActionFactory = (s: string) => WidgetTemplateAction;
export type WidgetExecFactory = (gp: object, e: Element[]) => void;
