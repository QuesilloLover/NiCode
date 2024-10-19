import re
import test


def testAnalyzer(string):
    separator = 'SEPARATOR_GOES_HERE\n'
    segments = string.split(separator)

    if len(segments) == 2:
        userOutput = segments[0]
        testCases = segments[1]

    print(testCases)

    lines = testCases.split(';')[:-1]
    testResults = []
    isCorrect = True
    totalTestcases = 0
    badTestcase = -1


    for line in lines:
        totalTestcases += 1
        elements = line.split('|')
        # Just change to check for [-1] and [-2] elements
        testResult = {}
        if elements[-1] == elements[-2]:
            testResult['result'] = 'Correct'
        else:
            testResult['result'] = 'Incorrect'
            isCorrect = False
            badTestcase = totalTestcases
            break

        testResults.append(line)

    response =  {
        'isCorrect': isCorrect,
        'totalTestcases': totalTestcases,
        'badTestcase': badTestcase if badTestcase != -1 else None, 
        'testResults': testResults 
    }

    return response

if __name__ == '__main__':
    print(testAnalyzer("""SEPARATOR_GOES_HERE
5|25|25;10|50|50;"""))