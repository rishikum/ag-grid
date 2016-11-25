// ag-grid-aurelia v7.0.0-beta.0
import { Container, ViewFactory } from "aurelia-framework";
import { ICellRenderer, ICellEditor } from "ag-grid/main";
export declare class AureliaComponentFactory {
    createRendererFromTemplate(container: Container, viewFactory: ViewFactory): {
        new (): ICellRenderer;
    };
    createEditorFromTemplate(container: Container, viewFactory: ViewFactory): {
        new (): ICellEditor;
    };
}
