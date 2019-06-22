import {
    _,
    AgCheckbox,
    AgGroupComponent,
    AgInputTextField,
    Component,
    PostConstruct,
    RefSelector
} from "ag-grid-community";
import {ChartController} from "../../chartController";
import {Chart} from "../../../../charts/chart/chart";
import {BarSeries} from "../../../../charts/chart/series/barSeries";
import {ChartShadowPanel} from "./chartShadowPanel";
import {ChartLabelPanel, ChartLabelPanelParams} from "./chartLabelPanel";

export class ChartBarSeriesPanel extends Component {

    public static TEMPLATE =
        `<div>   
            <ag-group-component ref="seriesGroup">
                <ag-input-text-field ref="inputSeriesStrokeWidth"></ag-input-text-field>
                <ag-checkbox ref="cbTooltipsEnabled"></ag-checkbox>                          
                <ag-input-text-field ref="inputSeriesLabelOffset"></ag-input-text-field>
            </ag-group-component>
        </div>`;

    @RefSelector('seriesGroup') private seriesGroup: AgGroupComponent;
    @RefSelector('inputSeriesStrokeWidth') private inputSeriesStrokeWidth: AgInputTextField;
    @RefSelector('cbTooltipsEnabled') private cbTooltipsEnabled: AgCheckbox;
    @RefSelector('inputSeriesLabelOffset') private inputSeriesLabelOffset: AgInputTextField;

    private readonly chartController: ChartController;
    private chart: Chart;
    private activePanels: Component[] = [];

    constructor(chartController: ChartController) {
        super();
        this.chartController = chartController;
    }

    @PostConstruct
    private init() {
        this.setTemplate(ChartBarSeriesPanel.TEMPLATE);

        const chartProxy = this.chartController.getChartProxy();
        this.chart = chartProxy.getChart();

        this.initSeriesStrokeWidth();
        this.initSeriesTooltips();
        this.initLabelPanel();
        this.initShadowPanel();
    }

    private initSeriesStrokeWidth() {
        this.seriesGroup.setLabel('Series');

        this.inputSeriesStrokeWidth.setLabel('Stroke Width');

        const barSeries = this.chart.series as BarSeries[];
        if (barSeries.length > 0) {
            this.inputSeriesStrokeWidth.setValue(`${barSeries[0].strokeWidth}`);
        }

        this.addDestroyableEventListener(this.inputSeriesStrokeWidth.getInputElement(), 'input', () => {
            (this.chart.series as BarSeries[]).forEach(series => {
                series.strokeWidth = Number.parseInt(this.inputSeriesStrokeWidth.getValue());
            });
        });
    }

    private initSeriesTooltips() {

        // TODO update code below when this.chart.showTooltips is available
        const enabled = _.every(this.chart.series, (series) => series.tooltipEnabled);
        this.cbTooltipsEnabled.setLabel('Tooltips');
        this.cbTooltipsEnabled.setSelected(enabled);
        this.addDestroyableEventListener(this.cbTooltipsEnabled, 'change', () => {
            this.chart.series.forEach(series => {
                series.tooltipEnabled = this.cbTooltipsEnabled.isSelected();
            });
        });
    }

    private initLabelPanel() {
        const barSeries = this.chart.series as BarSeries[];
        const params: ChartLabelPanelParams = {
            chartController: this.chartController,
            isEnabled: () => {
                return barSeries.some(series => series.labelEnabled);
            },
            setEnabled: (enabled: boolean) => {
                barSeries.forEach(series => series.labelEnabled = enabled);
            },
            getFont: () => barSeries.length > 0 ? barSeries[0].labelFont : '',
            setFont: (font: string) => {
                barSeries.forEach(series => series.labelFont = font);
            },
            getColor: () => barSeries.length > 0 ? barSeries[0].labelColor : '',
            setColor: (color: string) => {
                barSeries.forEach(series => series.labelColor = color);
            }
        };

        const labelPanelComp = new ChartLabelPanel(params);
        this.getContext().wireBean(labelPanelComp);
        this.seriesGroup.getGui().appendChild(labelPanelComp.getGui());
        this.activePanels.push(labelPanelComp);
    }

    private initShadowPanel() {
        const shadowPanelComp = new ChartShadowPanel(this.chartController);
        this.getContext().wireBean(shadowPanelComp);
        this.seriesGroup.getGui().appendChild(shadowPanelComp.getGui());
        this.activePanels.push(shadowPanelComp);
    }

    private destroyActivePanels(): void {
        this.activePanels.forEach(panel => {
            _.removeFromParent(panel.getGui());
            panel.destroy();
        });
    }

    public destroy(): void {
        this.destroyActivePanels();
        super.destroy();
    }
}