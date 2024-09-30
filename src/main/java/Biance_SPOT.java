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
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;


public class Biance_SPOT {
    private static final File API_KEY = new File("apiKey.in");
    private static final File SECRET_KEY = new File("secretKey.in");
    protected String symbol;
    protected String interval;

    Biance_SPOT(String symbol, String interval) {
        this.symbol = symbol;
        this.interval = interval;
    }
    protected JsonArray getResultAsJson() {
        JsonArray data = getQueryResult(symbol, interval, createClient());
        int dataSize = data.size();
        int segment[] = makeTrends(data, dataSize);
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM");
        JsonArray resultArray = new JsonArray();
        JsonArray risePhase = new JsonArray();
        JsonArray fallPhase = new JsonArray();

        for (int j = 0; j < dataSize; j++) {
            JsonArray klineData = data.get(j).getAsJsonArray();
            long openTimeMillis = klineData.get(0).getAsLong();
            long closeTimeMillis = klineData.get(6).getAsLong();
            long tradeTimeMillis = (openTimeMillis + closeTimeMillis) / 2;
            double high = getHigh(klineData);
            double low = getLow(klineData);
            double volume = klineData.get(5).getAsDouble();

            ZonedDateTime tradeTime = Instant.ofEpochMilli(tradeTimeMillis).atZone(ZoneId.systemDefault());

            JsonObject unitInfo = new JsonObject();

            unitInfo.addProperty("Time", tradeTime.format(formatter));

            if (segment[j] == 1) {
                unitInfo.addProperty("Price", high);
                unitInfo.addProperty("Volume", volume);
                risePhase.add(unitInfo);
            } else if (segment[j] == -1) {
                unitInfo.addProperty("Price", low);
                unitInfo.addProperty("Volume", volume);
                fallPhase.add(unitInfo);
            }
        }

        resultArray.add(risePhase);
        resultArray.add(fallPhase);
        return resultArray;
    }

    private static JsonArray getQueryResult(String symbol, String interval, SpotClient client) {
        Map<String, Object> parameters = new LinkedHashMap<>();
        parameters.put("symbol", symbol);
        parameters.put("interval", interval);
        String result = client.createMarket().uiKlines(parameters);
        return JsonParser.parseString(result).getAsJsonArray();
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
    private static int[] makeTrends(JsonArray jar, int size) {
        int i = 0;
        int segment[] = new int[size];
        int baseState = 0;
        while (i < size - 2) {
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
                } else {
                    setSegment(segment, i, 1, 0);
                    baseState = 0;
                    i++;
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
        return segment;
    }
    private SpotClient createClient() {
        String apiKey = "";
        String secret = "";
        try {
            Scanner apiScanner = new Scanner(API_KEY);
            Scanner secScanner = new Scanner(SECRET_KEY);
            apiKey = apiScanner.next();
            secret = secScanner.next();
            apiScanner.close();
            secScanner.close();
        } catch (FileNotFoundException e) {
            throw new RuntimeException(e);
        }
        return new SpotClientImpl(apiKey, secret);
    }
}
