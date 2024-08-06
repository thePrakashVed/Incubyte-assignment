/**
 * A utility class for performing string-based arithmetic calculations.
 * 
 * The `StringCalculator` class provides a method to add numbers represented as
 * a string. The string can include:
 * - Standard comma (`,`) or newline (`\n`) as delimiters.
 * - Custom delimiters specified at the beginning of the string, using a format
 *   that allows for single or multiple delimiters enclosed in square brackets.
 */

class StringCalculator {

    /**
     * Adds the numbers contained in a string. The string can contain numbers separated by
     * commas, new lines, or custom delimiters specified in the first line of the string.
     * The method also checks for negative numbers and will throw an error if any are found.
     * Numbers greater than 1000 are ignored in the sum.
     * 
     * @param {string} numbers - The string containing the numbers to add, which may include:
     *                           - Comma (`,`) or newline (`\n`) separated values.
     *                           - A custom delimiter specified at the beginning of the string.
     * @returns {number} - The sum of the numbers, ignoring numbers greater than 1000.
     * @throws {Error} - Throws an error if any negative numbers are present in the input string.
     */

    public static add(numbers: string): number {
        if (numbers === "") {
            return 0;
        }
        const delimiters = this.getDelimiters(numbers);
        const numArray = this.splitNumbers(numbers, delimiters);
        this.checkForNegativeNumbers(numArray);
        return numArray
            .map(num => parseInt(num, 10))
            .filter(num => num <= 1000) 
            .reduce((sum, num) => sum + num, 0);
    }

    /**
     * Extracts custom delimiters from the input string.
     * The delimiters are specified in the first line of the string, starting with `//`.
     * Multiple delimiters can be specified and should be enclosed in square brackets.
     * For example, "//[delimiter1][delimiter2]\n" will set delimiter1 and delimiter2.
     *
     * @param {string} numbers - The input string containing the numbers and optional delimiters.
     * @returns {string[]} - An array of custom delimiters extracted from the input string.
     *                       Returns a default delimiter (`,`) if no custom delimiters are found.
     */
    private static getDelimiters(numbers: string): string[] {
        const delimiterMatch = numbers.match(/^\/\/(.*?)\n/);
        if (delimiterMatch) {
            const rawDelimiters = delimiterMatch[1];
            return rawDelimiters.split(/\]\[/).map(d => d.replace(/[\[\]]/g, '')); // Clean brackets
        }
        return [","]; 
    }

    /**
     * Splits the input string into an array of numbers based on the specified delimiters.
     * The method first removes any custom delimiter specification line from the input string.
     * It then constructs a regular expression using the provided delimiters to split the
     * string and filter out any empty entries.
     *
     * @param {string} numbers - The input string containing numbers to be split.
     * @param {string[]} delimiters - An array of delimiters used to separate the numbers in the input string.
     * @returns {string[]} - An array of strings representing the individual numbers extracted from the input string.
     */
    private static splitNumbers(numbers: string, delimiters: string[]): string[] {
        const normalizedNumbers = numbers.replace(/^\/\/.*?\n/, '');
        const delimiterPattern = delimiters.join('|');
        const regex = new RegExp(`[${delimiterPattern}\n]+`);

        return normalizedNumbers.split(regex).filter(Boolean);
    }

    /**
     * Checks the provided array of number strings for any negative numbers.
     * If any negative numbers are found, an error is thrown, indicating
     * which negative numbers are present in the input array.
     *
     * @param {string[]} numArray - An array of strings representing the numbers to check for negativity.
     * @throws {Error} - Throws an error if any negative numbers are found in the input array.
     */
    private static checkForNegativeNumbers(numArray: string[]): void {
        const negativeNumbers = numArray.filter(num => parseInt(num, 10) < 0);
        if (negativeNumbers.length > 0) {
            throw new Error(`negative numbers not allowed: ${negativeNumbers.join(', ')}`);
        }
    }
}

/**
 * Example usage of the StringCalculator class demonstrating error handling.
 * This code attempts to add a string of numbers that includes a negative number.
 * It expects the add method to throw an error, which is caught in the catch block.
 * The error message is then logged to the console, indicating the presence of
 * negative numbers, which are not allowed according to the calculator's rules.
 */

try {
    console.log(StringCalculator.add("//;\n1;-2;3")); 
} catch (error:any) {
    console.error(error.message); 
}

try {
    console.log(StringCalculator.add("//[**][%%]\n1**-2%%3")); 
} catch (error:any) {
    console.error(error.message); 
}


/**
 * Below is the different example to test the results
 */

console.log('Input - " "====', StringCalculator.add("")); // Expected Output: 0
console.log('Input - "1"====',StringCalculator.add("1")); // Expected Output: 1
console.log('Input - "1,5"====',StringCalculator.add("1,5")); // Expected Output: 6
console.log('Input - "1\n2,3"====',StringCalculator.add("1\n2,3")); // Expected Output: 6
console.log('Input - "//;\n1;2"====',StringCalculator.add("//;\n1;2")); // Expected Output: 3
console.log('Input - "//|\n1|2|3"====',StringCalculator.add("//|\n1|2|3")); // Expected Output: 6
console.log('Input - "//[**][%%]\n1**2%%3"====',StringCalculator.add("//[**][%%]\n1**2%%3")); // Expected Output: 6
console.log('Input - "//[*][%]\n1*2%3"====',StringCalculator.add("//[*][%]\n1*2%3")); // Expected Output: 6
console.log('Input - "//[***]\n1***2***3"====',StringCalculator.add("//[***]\n1***2***3")); // Expected Output: 6
console.log('Input - "2,1001"====',StringCalculator.add("2,1001")); // Expected Output: 2
console.log('Input - "//;\n1;1001;3"====',StringCalculator.add("//;\n1;1001;3")); // Expected Output: 4