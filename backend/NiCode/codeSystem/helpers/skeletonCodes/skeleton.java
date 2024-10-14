import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

public class Main {

    // Generic function to print any object type
    public static <T> String printResult(T result) {
        return result.toString();
    }

    // Specialization for arrays of objects
    public static <T> String printResult(T[] result) {
        return Arrays.stream(result)
                     .map(String::valueOf)
                     .collect(Collectors.joining(", "));
    }

    // Specialization for int arrays
    public static String printResult(int[] result) {
        return Arrays.toString(result);
    }

    // Specialization for double arrays
    public static String printResult(double[] result) {
        return Arrays.toString(result);
    }

    // Specialization for char arrays
    public static String printResult(char[] result) {
        return Arrays.toString(result);
    }

    // Specialization for String arrays
    public static String printResult(String[] result) {
        return "[" + Arrays.stream(result)
                     .collect(Collectors.joining(", ")) + "]";
    }

    //USER_FUNCTION_GOES_HERE   

    public static void main(String[] args) {
        String testResults = "";
        //TESTCASES_GOES_HERE
        String separator = "SEPARATOR_GOES_HERE";
        System.out.println(separator);
        System.out.println(testResults);
    }
}
