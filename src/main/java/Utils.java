import com.google.gson.JsonArray;
public class Utils {
    protected static JsonArray getRisePhaseFrom(JsonArray trend) {
        return trend.get(0).getAsJsonArray();
    }
    protected static JsonArray getFallPhaseFrom(JsonArray trend) {
        return trend.get(1).getAsJsonArray();
    }
}
