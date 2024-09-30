import java.io.File;
import java.io.FileNotFoundException;
import java.nio.file.Path;
import java.util.Map;
import java.util.Scanner;
import java.util.TreeMap;

import com.google.gson.JsonArray;

public class Main {
    public static void main(String[] args) throws FileNotFoundException {
        switch (args[0]) {
            case "trend":
                Map<String, String> allSymbols = new TreeMap<>();
                Scanner symbols = new Scanner(new File("symbols.in"));
                while (symbols.hasNextLine()) {
                    allSymbols.put(symbols.next(), "1M");
                }

                for (String key : allSymbols.keySet()) {
                    Biance_SPOT spot = new Biance_SPOT(key, allSymbols.get(key));
                    JsonArray trend = spot.getResultAsJson();
                    XYLineChart theChart = new XYLineChart("小猫比特", key + "_by_" + allSymbols.get(key), key, trend);
                    theChart.exportAsPNG();
                }
                break;
        }
    }
}
