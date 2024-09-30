import java.awt.BasicStroke;
import java.awt.Color;
import java.io.File;
import java.io.IOException;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import org.jfree.chart.ChartFactory;
import org.jfree.chart.ChartPanel;
import org.jfree.chart.JFreeChart;
import org.jfree.chart.plot.PlotOrientation;
import org.jfree.chart.plot.XYPlot;
import org.jfree.chart.renderer.xy.XYLineAndShapeRenderer;
import org.jfree.chart.ui.ApplicationFrame;
import org.jfree.data.xy.XYDataset;
import org.jfree.data.xy.XYSeries;
import org.jfree.data.xy.XYSeriesCollection;
import org.jfree.chart.util.ExportUtils;

public class XYLineChart extends ApplicationFrame {
    JFreeChart theChart;
    String name;

    public XYLineChart(String appTitle, String chartTitle, String symbol, JsonArray data) {
        super(appTitle);

        theChart = ChartFactory.createXYLineChart(
                chartTitle ,
                "Time" ,
                "Price" ,
                createDataset(symbol, data) ,
                PlotOrientation.VERTICAL ,
                true , true , false);
        name = chartTitle;

        ChartPanel chartPanel = new ChartPanel( theChart );
        chartPanel.setPreferredSize( new java.awt.Dimension( 560 , 367 ) );
        final XYPlot plot = theChart.getXYPlot( );

        XYLineAndShapeRenderer renderer = new XYLineAndShapeRenderer( );
        renderer.setSeriesPaint( 0 , Color.RED );
        renderer.setSeriesPaint( 1 , Color.GREEN );
        renderer.setSeriesStroke( 0 , new BasicStroke( 4.0f ) );
        renderer.setSeriesStroke( 1 , new BasicStroke( 3.0f ) );
        plot.setRenderer( renderer );
        setContentPane( chartPanel );
    }

    private XYDataset createDataset(String symbol, JsonArray data) {
        final XYSeries rise = new XYSeries(symbol + "-rise");
        getFromTrend(rise, data.get(0).getAsJsonArray());

        final XYSeries fall = new XYSeries(symbol + "-fall");
        getFromTrend(fall, data.get(1).getAsJsonArray());

        final XYSeriesCollection dataset = new XYSeriesCollection( );
        dataset.addSeries( rise );
        dataset.addSeries( fall );
        return dataset;
    }

    protected void exportAsPNG () {
        File XYChart = new File(  name + ".png" );
        try {
            ExportUtils.writeAsPNG(theChart, 1280, 640, XYChart);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    private void getFromTrend(XYSeries series, JsonArray trend) {
        for (int i = 0; i < trend.size(); i++) {
            JsonObject current = trend.get(i).getAsJsonObject();
            String time = current.get("Time").getAsString();
            series.add(i, current.get("Price").getAsDouble());
        }
    }
}
