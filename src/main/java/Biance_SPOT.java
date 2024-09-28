import java.io.File;
import java.io.FileNotFoundException;
import java.time.Instant;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Scanner;

import com.binance.connector.client.SpotClient;
import com.binance.connector.client.impl.SpotClientImpl;
import com.google.gson.JsonArray;
import com.google.gson.JsonParser;


public class Biance_SPOT {
    private static final File API_KEY = new File("apiKey.in");
    private static final File SECRET_KEY = new File("secretKey.in");
    protected static String symbol = "BTCUSDT";
    protected static String interval = "1M";
    public static void main(String[] args) {
        try {
            Scanner apiScanner = new Scanner(API_KEY);
            Scanner secScanner = new Scanner(SECRET_KEY);
            String apiKey = apiScanner.next();
            String secret = secScanner.next();
            apiScanner.close();
            secScanner.close();
        } catch (FileNotFoundException e) {
            throw new RuntimeException(e);
        }

        SpotClient client = new SpotClientImpl();
        Map<String, Object> parameters = new LinkedHashMap<>();
        parameters.put("symbol", symbol);
        parameters.put("interval", interval);

        String result = client.createMarket().uiKlines(parameters);

        JsonArray jar = JsonParser.parseString(result).getAsJsonArray();
        int jarSize = jar.size();

        int i = 0;
        int[] segment = new int[jarSize];
        int baseState = 0;
        while (i < jarSize - 1) {
            JsonArray baseMonth = getMonth(jar, i);
            JsonArray secondMonth = getMonth(jar, i+1);
            JsonArray thirdMonth = getMonth(jar, i+2);
            boolean rise = ((getHigh(secondMonth) - getHigh(baseMonth)) >= 0)
                    && (getHigh(thirdMonth) - getHigh(secondMonth) >= 0);
            boolean fall = ((getLow(secondMonth) - getLow(baseMonth)) <= 0)
                    && (getLow(thirdMonth) - getLow(secondMonth) <= 0);

            if (baseState == 0) {
                if (rise) {
                    setSegment(segment, i, 3, 1);
                    baseState = 1;
                    i += 3;
                } else if (fall) {
                    setSegment(segment, i, 3, -1);
                    baseState = -1;
                    i += 3;
                }
            } else if (baseState == 1) {
                if (fall) {
                    setSegment(segment, i, 3, -1);
                    baseState = -1;
                    i += 3;
                } else {
                    setSegment(segment, i, 1, 1);
                    i++;
                }
            } else { // base state == -1
                if (rise) {
                    setSegment(segment, i, 3, 1);
                    baseState = 1;
                    i+=3;
                } else {
                    setSegment(segment, i, 1, -1);
                    i++;
                }
            }
        }

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM");

        for (int j = 0; j < jarSize; j++) {
            JsonArray klineData = jar.get(j).getAsJsonArray();
            long openTimeMillis = klineData.get(0).getAsLong();
            double high = getHigh(klineData);
            double low = getLow(klineData);
            double volume = klineData.get(5).getAsDouble();

            ZonedDateTime openTime = Instant.ofEpochMilli(openTimeMillis).atZone(ZoneId.systemDefault());

            String header = "\n" + openTime.format(formatter) + ":\n";
            String content = "";

            if (segment[j] == 1) {
                content = "Highest price: %f; Volume: %f\n";
                String output = header + content;
                System.out.printf(output, high, volume);
            } else if (segment[j] == -1) {
                content = "Lowest price: %f; Volume: %f\n";
                String output = header + content;
                System.out.printf(output, low, volume);
            }
        }
    }

    private static double getHigh(JsonArray month) {
        return month.get(2).getAsDouble();
    }
    private static double getLow(JsonArray month) {
        return month.get(3).getAsDouble();
    }
    private static JsonArray getMonth(JsonArray t, int n) {
        return t.get(n).getAsJsonArray();
    }
    private static void setSegment(int[] segment, int start, int delta, int type) {
        int i = start;
        while (delta > 0) {
            segment[i] = type;
            i++;
            delta--;
        }
    }
}
